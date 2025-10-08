import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_PRODUCTS } from '@/constants/mockData';
import type { Product } from '@/types/product';
import ImageCarousel from '@/components/carousel/ImageCarousel';

const formatVND = (n: number) => n.toLocaleString('vi-VN') + 'đ';
const MAX_SUSTAIN = 5;

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [liked, setLiked] = useState(false);

    const product = useMemo<Product | undefined>(
        () => MOCK_PRODUCTS.find(p => String(p.id) === String(id)),
        [id]
    );

    const similar = useMemo<Product[]>(
        () =>
            product
                ? MOCK_PRODUCTS
                    .filter(p => p.category === product.category && String(p.id) !== String(product.id))
                    .slice(0, 8)
                : [],
        [product]
    );

    // Demo cart badge
    const cartCount = 3;

    if (!product) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
                <Text className="font-quicksandBold text-gray-700">Không tìm thấy sản phẩm</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-3 px-4 py-2 bg-green-600 rounded-xl">
                    <Text className="font-quicksandBold text-white">Quay lại</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    // ✅ Lấy danh sách ảnh: ưu tiên product.images, fallback product.image
    const images: string[] = Array.isArray((product as any).images) && (product as any).images.length > 0
        ? (product as any).images
        : [product.image];

    const handleBuyNow = () => {
        router.push('/(carts)/checkout');
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white px-5 py-4 border-b border-gray-100">
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2">
                        <Ionicons name="chevron-back" size={26} color="#374151" />
                    </TouchableOpacity>

                    <Text className="font-quicksandBold text-lg text-gray-800">Product Details</Text>

                    <TouchableOpacity
                        onPress={() => router.push('/(carts)')}
                        className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center relative"
                        activeOpacity={0.85}
                    >
                        <Ionicons name="cart-outline" size={22} color="#374151" />
                        {cartCount > 0 && (
                            <View className="absolute -top-1 -right-1 bg-green-600 rounded-full w-5 h-5 items-center justify-center">
                                <Text className="font-quicksandBold text-white text-[10px]">{cartCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
                {/* ✅ Carousel ảnh (chỉ bật khi images.length >= 2) */}
                <View className="mx-4 mt-4">
                    <ImageCarousel
                        images={images}
                        height={260}
                        borderRadius={16}
                        renderOverlayRightBottom={() => (
                            <TouchableOpacity
                                onPress={() => setLiked(v => !v)}
                                className="w-11 h-11 rounded-full bg-white/90 items-center justify-center"
                                activeOpacity={0.9}
                            >
                                <Ionicons name={liked ? 'heart' : 'heart-outline'} size={22} color={liked ? '#ef4444' : '#111827'} />
                            </TouchableOpacity>
                        )}
                    />
                </View>

                {/* Nhãn + tên + giá + điểm xanh */}
                <View className="px-5 pt-4">
                    <View className="self-start bg-green-50 px-2.5 py-1 rounded-md mb-2">
                        <Text className="font-quicksandBold text-green-700 text-[11px]">90%</Text>
                    </View>

                    <View className="flex-row justify-between items-start">
                        <Text className="font-quicksandBold text-[20px] text-gray-900 flex-1 pr-4">
                            {product.name}
                        </Text>
                        <Text className="font-quicksandBold text-green-600 text-[20px]">
                            {formatVND(product.price)}
                        </Text>
                    </View>

                    {/* Điểm xanh */}
                    <View className="flex-row items-center mt-3">
                        <View className="flex-row mr-2">
                            {Array.from({ length: MAX_SUSTAIN }).map((_, idx) => (
                                <View
                                    key={idx}
                                    className={`w-3 h-3 rounded-full mr-1 ${
                                        idx < (product.sustainability ?? 0) ? 'bg-green-600' : 'bg-gray-300'
                                    }`}
                                />
                            ))}
                        </View>
                        <Text className="font-quicksand text-gray-600 text-[13px]">
                            Điểm xanh: <Text className="font-quicksandBold text-green-700">
                            {product.sustainability}/{MAX_SUSTAIN}
                        </Text>
                        </Text>
                    </View>

                    <Text className="font-quicksand text-gray-600 mt-3 leading-5">
                        {product.description}
                    </Text>
                </View>

                {/* Similar Products */}
                {similar.length > 0 && (
                    <View className="mt-6">
                        <View className="px-5 flex-row items-center justify-between mb-3">
                            <Text className="font-quicksandBold text-gray-900 text-base">Sản phẩm tương tự</Text>
                            <TouchableOpacity activeOpacity={0.7}>
                                <Text className="font-quicksandBold text-green-600">Tất cả</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                            {similar.map(sp => (
                                <TouchableOpacity
                                    key={sp.id}
                                    onPress={() => router.push(`/(products)/${sp.id}`)}
                                    className="mr-3 w-40 bg-white rounded-2xl overflow-hidden"
                                    activeOpacity={0.9}
                                >
                                    <Image source={{ uri: sp.image }} style={{ width: '100%', height: 110 }} />
                                    <View className="p-3">
                                        <Text className="font-quicksand text-gray-800" numberOfLines={1}>{sp.name}</Text>
                                        <Text className="font-quicksandBold text-green-600 mt-1" numberOfLines={1}>
                                            {formatVND(sp.price)}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                            <View style={{ width: 8 }} />
                        </ScrollView>
                    </View>
                )}
            </ScrollView>

            {/* Bottom actions (fixed) */}
            <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 pt-3 pb-5">
                <View className="flex-row items-center gap-4">
                    <TouchableOpacity
                        onPress={() => Alert.alert('✅ Đã thêm vào giỏ')}
                        className="flex-1 py-4 rounded-2xl items-center justify-center border border-green-600 bg-white"
                        activeOpacity={0.95}
                    >
                        <Text className="font-quicksandBold text-green-700 text-[16px]">Thêm vào giỏ</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleBuyNow}
                        className="flex-1 py-4 rounded-2xl items-center justify-center bg-green-600"
                        activeOpacity={0.95}
                    >
                        <Text className="font-quicksandBold text-white text-[16px]">Mua ngay</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
