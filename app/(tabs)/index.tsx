import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import {
    Text,
    View,
    TouchableOpacity,
    Alert,
    Image,
    Dimensions,
    FlatList,
    ListRenderItemInfo,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Animated
} from "react-native";
import ProductList from "@/components/product/ProductList";
import { MOCK_PRODUCTS, CATEGORIES } from "@/constants/mockData";
import { Product, ProductCategory } from "@/types/product";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import InfiniteCarousel from '@/components/carousel/InfiniteCarousel';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Banner layout
const BANNER_WIDTH = SCREEN_WIDTH * 0.95;
const BANNER_HEIGHT = BANNER_WIDTH * 0.7;

interface Banner {
    id: string;
    title: string;
    description: string;
    image: string;
    type: 'event' | 'promotion';
}

const BANNERS: Banner[] = [
    { id: '1', title: 'Sự kiện Thu Đông 2024', description: 'Giảm giá 50% toàn bộ bộ sưu tập', image: 'https://thebodyshop.com.vn/media/wysiwyg/hhen-nie/quan-ao-cu-banner.jpg', type: 'event' },
    { id: '2', title: 'Ưu đãi đặc biệt', description: 'Mua 2 tặng 1 - Áo thun organic', image: 'https://kilala.vn/data/uploads/2024/1732009105-poster.jpg', type: 'promotion' },
    { id: '3', title: 'Tuần lễ xanh', description: 'Nhận 200 điểm khi mua hàng', image: 'https://reshare.vn/cdn-cgi/image/width=2000,quality=75/https://reshare.vn/images/home-banner-8.png', type: 'event' }
];

// ===== Banner Item (animate scale + opacity) =====
const BannerItem = React.memo(
    ({ item, vIndex, scrollX }: { item: Banner; vIndex: number; scrollX: Animated.Value }) => {
        const inputRange = [
            (vIndex - 1) * SCREEN_WIDTH,
            vIndex * SCREEN_WIDTH,
            (vIndex + 1) * SCREEN_WIDTH,
        ];
        const scale = scrollX.interpolate({ inputRange, outputRange: [0.92, 1, 0.92], extrapolate: 'clamp' });
        const opacity = scrollX.interpolate({ inputRange, outputRange: [0.7, 1, 0.7], extrapolate: 'clamp' });

        const handlePress = () => Alert.alert(item.title, item.description, [{ text: 'Đóng' }]);

        return (
            <View style={{ width: SCREEN_WIDTH, alignItems: 'center', justifyContent: 'center' }}>
                <Animated.View style={{ transform: [{ scale }], opacity }}>
                    <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={{ width: BANNER_WIDTH }}>
                        <View className="bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
                            <Image source={{ uri: item.image }} style={{ width: '100%', height: BANNER_HEIGHT }} resizeMode="cover" />
                            {/* Overlay compact */}
                            <View className="absolute bottom-3 left-3 right-3">
                                <View className="bg-black/40 backdrop-blur-md rounded-xl p-2.5">
                                    <View className="flex-row items-center justify-between">
                                        <View className="flex-1 mr-2">
                                            <Text className="font-quicksandBold text-white text-sm leading-tight mb-0.5" numberOfLines={1}>
                                                {item.title}
                                            </Text>
                                            <Text className="font-quicksand text-white/80 text-[11px] leading-tight" numberOfLines={1}>
                                                {item.description}
                                            </Text>
                                        </View>
                                        <View className={`px-2 py-1 rounded-lg ${item.type === 'event' ? 'bg-blue-500' : 'bg-orange-500'}`}>
                                            <Text className="font-quicksandBold text-white text-[9px]">
                                                {item.type === 'event' ? 'Sự kiện' : 'Giảm giá'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    }
);

export default function HomeScreen() {
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
    const [products] = useState<Product[]>(MOCK_PRODUCTS);
    const [activeBannerIndex, setActiveBannerIndex] = useState(0); // index thực (0..N-1)

    // ===== Loop setup =====
    const loopedData = useMemo(() => {
        if (BANNERS.length <= 1) return BANNERS;
        const first = BANNERS[0];
        const last = BANNERS[BANNERS.length - 1];
        return [last, ...BANNERS, first]; // [DUP_LAST, ...REAL..., DUP_FIRST]
    }, []);
    const VLEN = loopedData.length;
    const INITIAL_VINDEX = BANNERS.length > 1 ? 1 : 0; // bắt đầu ở item thực đầu tiên

    const bannerRef = useRef<FlatList<Banner>>(null);
    const scrollX = useRef(new Animated.Value(INITIAL_VINDEX * SCREEN_WIDTH)).current;
    const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);
    const isUserInteracting = useRef(false);
    const currentVIndex = useRef(INITIAL_VINDEX);

    const filteredProducts = useMemo(
        () => (selectedCategory === 'all' ? products : products.filter(p => p.category === selectedCategory)),
        [selectedCategory, products]
    );

    // Jump đến INITIAL_VINDEX sau khi mount
    useEffect(() => {
        requestAnimationFrame(() => {
            bannerRef.current?.scrollToOffset({ offset: INITIAL_VINDEX * SCREEN_WIDTH, animated: false });
            currentVIndex.current = INITIAL_VINDEX;
            setActiveBannerIndex(0);
        });
    }, []);

    // Auto scroll
    const startAutoScroll = useCallback(() => {
        if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
        if (BANNERS.length <= 1) return;

        autoScrollTimer.current = setInterval(() => {
            if (!isUserInteracting.current) {
                const nextV = currentVIndex.current + 1;
                bannerRef.current?.scrollToOffset({ offset: nextV * SCREEN_WIDTH, animated: true });
            }
        }, 3500);
    }, []);

    useEffect(() => {
        startAutoScroll();
        return () => {
            if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
        };
    }, [startAutoScroll]);

    // Scroll handlers
    const onScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: true }
    );

    const normalizeRealIndex = (vIndex: number) => {
        // map virtual index -> real (0..N-1)
        if (BANNERS.length <= 1) return 0;
        if (vIndex === 0) return BANNERS.length - 1; // dup_last
        if (vIndex === VLEN - 1) return 0;           // dup_first
        return vIndex - 1;
    };

    const onMomentumScrollEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = e.nativeEvent.contentOffset.x;
        let vIndex = Math.round(offsetX / SCREEN_WIDTH);

        // sửa biên để loop mượt (nhảy không animation)
        if (BANNERS.length > 1) {
            if (vIndex === 0) {
                vIndex = VLEN - 2; // nhảy về item thực cuối
                bannerRef.current?.scrollToOffset({ offset: vIndex * SCREEN_WIDTH, animated: false });
            } else if (vIndex === VLEN - 1) {
                vIndex = 1; // nhảy về item thực đầu
                bannerRef.current?.scrollToOffset({ offset: vIndex * SCREEN_WIDTH, animated: false });
            }
        }

        currentVIndex.current = vIndex;
        setActiveBannerIndex(normalizeRealIndex(vIndex));
        isUserInteracting.current = false;
    }, [VLEN]);

    const onScrollBeginDrag = useCallback(() => {
        isUserInteracting.current = true;
        if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
    }, []);

    const onScrollEndDrag = useCallback(() => {
        setTimeout(() => {
            if (!isUserInteracting.current) startAutoScroll();
        }, 500);
    }, [startAutoScroll]);

    const handleProductPress = useCallback((product: Product) => {
        router.push(`/(products)/${product.id}`);
    }, []);

    const renderBannerItem = useCallback(
        ({ item, index }: ListRenderItemInfo<Banner>) => <BannerItem item={item} vIndex={index} scrollX={scrollX} />,
        [scrollX]
    );

    // Header
    const ListHeader = useMemo(() => {
        return (
            <>
                {/* Banner Section */}
                <View className="bg-gray-50 py-6">
                    <InfiniteCarousel
                        data={BANNERS}
                        keyExtractor={(b) => b.id}
                        renderItem={({ item, realIndex, width }) => (
                            <TouchableOpacity
                                onPress={() => Alert.alert(item.title, item.description)}
                                activeOpacity={0.9}
                            >
                                <View
                                    style={{
                                        width: width * 0.95,
                                        borderRadius: 16,
                                        overflow: 'hidden',
                                        backgroundColor: '#F3F4F6',
                                    }}
                                >
                                    <Image source={{ uri: item.image }} style={{ width: '100%', height: (width * 0.95) * 0.7 }} />
                                    <View className="absolute bottom-3 left-3 right-3">
                                        <View className="bg-black/40 rounded-xl p-2.5">
                                            <View className="flex-row items-center justify-between">
                                                <View className="flex-1 mr-2">
                                                    <Text className="font-quicksandBold text-white text-sm" numberOfLines={1}>
                                                        {item.title}
                                                    </Text>
                                                    <Text className="font-quicksand text-white/80 text-[11px]" numberOfLines={1}>
                                                        {item.description}
                                                    </Text>
                                                </View>
                                                <View className={`px-2 py-1 rounded-lg ${item.type === 'event' ? 'bg-blue-500' : 'bg-orange-500'}`}>
                                                    <Text className="font-quicksandBold text-white text-[10px]">
                                                        {item.type === 'event' ? 'Sự kiện' : 'Giảm giá'}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>

                <View className="bg-gray-50 py-4 mt-2">
                    <Text className="font-quicksandBold text-base text-gray-800 px-5 mb-3">Danh mục</Text>
                    <FlatList
                        data={CATEGORIES}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 16 }}
                        renderItem={({ item: category }) => (
                            <TouchableOpacity
                                onPress={() => setSelectedCategory(category.id as ProductCategory)}
                                className={`mr-3 px-5 py-2.5 rounded-full flex-row items-center ${
                                    selectedCategory === category.id ? 'bg-green-600' : 'bg-white'
                                }`}
                                activeOpacity={0.7}
                            >
                                <Text className="mr-1.5">{category.icon}</Text>
                                <Text
                                    className={`font-quicksandSemiBold text-sm ${
                                        selectedCategory === category.id ? 'text-white' : 'text-gray-700'
                                    }`}
                                >
                                    {category.name}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>

                <View className="bg-gray-50 mt-2 pt-4">
                    <View className="px-5 pb-3 flex-row justify-between items-center">
                        <Text className="font-quicksandBold text-base text-gray-800">Sản phẩm nổi bật</Text>
                        <Text className="font-quicksand text-sm text-gray-600">
                            <Text className="font-quicksandSemiBold text-green-600">{filteredProducts.length}</Text> sản phẩm
                        </Text>
                    </View>
                </View>
            </>
        );
    }, [
        loopedData,
        renderBannerItem,
        onScroll,
        onMomentumScrollEnd,
        onScrollBeginDrag,
        onScrollEndDrag,
        scrollX,
        selectedCategory,
        filteredProducts.length,
        startAutoScroll
    ]);

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white px-5 py-4">
                <View className="flex-row items-center justify-between">
                    <View>
                        <Text className="font-quicksandBold text-2xl text-gray-800">GreenLoop</Text>
                        <Text className="font-quicksand text-sm text-gray-500 mt-1">Thời trang bền vững 🌿</Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => router.push('/(carts)')}
                        className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center relative"
                    >
                        <Ionicons name="cart-outline" size={24} color="#374151" />
                        <View className="absolute -top-1 -right-1 bg-green-600 rounded-full w-5 h-5 items-center justify-center">
                            <Text className="font-quicksandBold text-white text-xs">3</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <ProductList
                products={filteredProducts}
                onProductPress={handleProductPress}
                ListHeaderComponent={ListHeader}
            />
        </SafeAreaView>
    );
}
