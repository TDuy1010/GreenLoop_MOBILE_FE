import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import InfiniteCarousel from './InfiniteCarousel';

type Props = {
    images: string[];                 // danh sách url ảnh
    height: number;                   // chiều cao slide
    borderRadius?: number;            // bo góc
    onImagePress?: (index: number) => void;
    renderOverlayRightBottom?: (index: number) => React.ReactNode; // ví dụ: nút tim
};

export default function ImageCarousel({
                                          images,
                                          height,
                                          borderRadius = 16,
                                          onImagePress,
                                          renderOverlayRightBottom,
                                      }: Props) {
    return (
        <InfiniteCarousel<string>
            data={images}
            keyExtractor={(u, i) => `${i}-${u}`}
            renderItem={({ item, realIndex, width }) => (
                <View
                    style={{
                        width: width * 0.95,
                        overflow: 'hidden',
                        borderRadius,
                        backgroundColor: '#F3F4F6',
                    }}
                >
                    <TouchableOpacity activeOpacity={0.9} onPress={() => onImagePress?.(realIndex)}>
                        <Image source={{ uri: item }} style={{ width: '100%', height }} resizeMode="cover" />
                    </TouchableOpacity>

                    {/* overlay bottom-right nếu cần */}
                    <View style={{ position: 'absolute', right: 12, bottom: 12 }}>
                        {renderOverlayRightBottom?.(realIndex)}
                    </View>
                </View>
            )}
            contentContainerStyle={{ alignItems: 'center' }}
        />
    );
}
