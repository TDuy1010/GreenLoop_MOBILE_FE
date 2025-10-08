import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import {
    View,
    FlatList,
    Dimensions,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Animated,
    TouchableOpacity,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type RenderParams<T> = {
    item: T;
    index: number;           // virtual index
    realIndex: number;       // 0..N-1
    scrollX: Animated.Value; // cho scale/opacity nếu cần
    width: number;
};

type Props<T> = {
    data: T[];
    keyExtractor: (item: T, index: number) => string;
    renderItem: (p: RenderParams<T>) => React.ReactNode;

    // UI
    width?: number;            // default: SCREEN_WIDTH
    showIndicators?: boolean;  // default: true
    indicatorColor?: string;   // default: '#16A34A'
    indicatorInactive?: string;// default: '#D1D5DB'

    // Behavior
    loop?: boolean;            // default: true (chỉ chạy khi data.length>1)
    autoplay?: boolean;        // default: true (chỉ chạy khi data.length>1)
    intervalMs?: number;       // default: 3500

    // Styling
    contentContainerStyle?: any;
};

export default function InfiniteCarousel<T>(props: Props<T>) {
    const {
        data,
        keyExtractor,
        renderItem,
        width = SCREEN_WIDTH,
        showIndicators = true,
        indicatorColor = '#16A34A',
        indicatorInactive = '#D1D5DB',
        loop = true,
        autoplay = true,
        intervalMs = 3500,
        contentContainerStyle,
    } = props;

    const canCarousel = data.length > 1;
    const shouldLoop = loop && canCarousel;
    const shouldAutoplay = autoplay && canCarousel;

    // Tạo mảng ảo: [dupLast, ...data, dupFirst]
    const loopedData = useMemo(() => {
        if (!shouldLoop) return data;
        const first = data[0];
        const last = data[data.length - 1];
        return [last, ...data, first];
    }, [data, shouldLoop]);

    const VLEN = loopedData.length;
    const INITIAL_VINDEX = shouldLoop ? 1 : 0;

    const listRef = useRef<FlatList<T>>(null);
    const scrollX = useRef(new Animated.Value(INITIAL_VINDEX * width)).current;
    const autoTimer = useRef<NodeJS.Timeout | null>(null);
    const isUserInteracting = useRef(false);
    const currentVIndex = useRef(INITIAL_VINDEX);

    // Jump initial
    useEffect(() => {
        requestAnimationFrame(() => {
            listRef.current?.scrollToOffset({ offset: INITIAL_VINDEX * width, animated: false });
            currentVIndex.current = INITIAL_VINDEX;
        });
    }, [width, INITIAL_VINDEX]);

    // Autoplay
    const startAuto = useCallback(() => {
        if (autoTimer.current) clearInterval(autoTimer.current);
        if (!shouldAutoplay) return;

        autoTimer.current = setInterval(() => {
            if (!isUserInteracting.current) {
                const nextV = currentVIndex.current + 1;
                listRef.current?.scrollToOffset({ offset: nextV * width, animated: true });
            }
        }, intervalMs);
    }, [intervalMs, shouldAutoplay, width]);

    useEffect(() => {
        startAuto();
        return () => {
            if (autoTimer.current) clearInterval(autoTimer.current);
        };
    }, [startAuto]);

    // Handlers
    const onScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: true }
    );

    const mapVirtualToReal = (vIndex: number) => {
        if (!shouldLoop) return vIndex;
        if (vIndex === 0) return data.length - 1; // dupLast
        if (vIndex === VLEN - 1) return 0;        // dupFirst
        return vIndex - 1;
    };

    const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = e.nativeEvent.contentOffset.x;
        let vIndex = Math.round(offsetX / width);

        if (shouldLoop) {
            if (vIndex === 0) {
                vIndex = VLEN - 2;
                listRef.current?.scrollToOffset({ offset: vIndex * width, animated: false });
            } else if (vIndex === VLEN - 1) {
                vIndex = 1;
                listRef.current?.scrollToOffset({ offset: vIndex * width, animated: false });
            }
        }
        currentVIndex.current = vIndex;
        isUserInteracting.current = false;
    };

    const onBeginDrag = () => {
        isUserInteracting.current = true;
        if (autoTimer.current) clearInterval(autoTimer.current);
    };

    const onEndDrag = () => {
        setTimeout(() => {
            if (!isUserInteracting.current) startAuto();
        }, 400);
    };

    // Render slide: truyền thêm realIndex + animated
    const renderSlide = ({ item, index }: { item: T; index: number }) => {
        const realIndex = mapVirtualToReal(index);
        return (
            <View style={{ width, alignItems: 'center', justifyContent: 'center' }}>
                {renderItem({ item, index, realIndex, scrollX, width })}
            </View>
        );
    };

    // Indicators
    const Indicators = () => {
        if (!showIndicators || !canCarousel) return null;
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
                {data.map((_, realIdx) => {
                    const center = (shouldLoop ? (realIdx + 1) : realIdx) * width;
                    const inputRange = [center - width, center, center + width];

                    const scaleX = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.33, 1, 0.33],
                        extrapolate: 'clamp',
                    });
                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp',
                    });

                    return (
                        <TouchableOpacity
                            key={realIdx}
                            onPress={() => {
                                isUserInteracting.current = true;
                                const targetVIndex = shouldLoop ? realIdx + 1 : realIdx;
                                currentVIndex.current = targetVIndex;
                                listRef.current?.scrollToOffset({ offset: targetVIndex * width, animated: true });
                                setTimeout(() => {
                                    isUserInteracting.current = false;
                                    startAuto();
                                }, 400);
                            }}
                            style={{ paddingHorizontal: 4 }}
                        >
                            <Animated.View
                                style={{
                                    width: Math.max(18, Math.min(28, width * 0.06)),
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: indicatorColor,
                                    opacity,
                                    transform: [{ scaleX }],
                                }}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    // Nếu chỉ có 1 item → render trực tiếp item, không FlatList, không indicators
    if (!canCarousel) {
        return (
            <View style={contentContainerStyle}>
                {renderItem({ item: data[0], index: 0, realIndex: 0, scrollX, width })}
            </View>
        );
    }

    return (
        <View style={contentContainerStyle}>
            <Animated.FlatList
                ref={listRef}
                data={loopedData as unknown as T[]}
                keyExtractor={(_, idx) => `v-${idx}`}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                renderItem={renderSlide}
                onScroll={onScroll}
                onMomentumScrollEnd={onMomentumEnd}
                onScrollBeginDrag={onBeginDrag}
                onScrollEndDrag={onEndDrag}
                scrollEventThrottle={16}
                decelerationRate="fast"
                bounces={false}
                getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
                initialScrollIndex={INITIAL_VINDEX}
                onScrollToIndexFailed={(info) =>
                    setTimeout(() => listRef.current?.scrollToIndex({ index: info.index, animated: false }), 250)
                }
            />
            <Indicators />
        </View>
    );
}
