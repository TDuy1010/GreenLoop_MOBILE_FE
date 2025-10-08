import React, { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    size?: string;
    color?: string;
}

export default function CartScreen() {
    // Mock data - sau này sẽ lấy từ context/redux
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: '1',
            name: 'Áo thun cotton organic',
            price: 299000,
            quantity: 1,
            image: 'https://via.placeholder.com/100',
            size: 'M',
            color: 'Trắng'
        },
        {
            id: '2',
            name: 'Quần jean tái chế',
            price: 599000,
            quantity: 2,
            image: 'https://via.placeholder.com/100',
            size: 'L',
            color: 'Xanh đen'
        }
    ]);

    const updateQuantity = (id: string, change: number) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(1, item.quantity + change);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const removeItem = (id: string) => {
        Alert.alert(
            'Xóa sản phẩm',
            'Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?',
            [
                { text: 'Hủy', style: 'cancel' },
                { 
                    text: 'Xóa', 
                    style: 'destructive',
                    onPress: () => setCartItems(prev => prev.filter(item => item.id !== id))
                }
            ]
        );
    };

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const handleCheckout = () => {
        router.push('/(carts)/checkout');
    };

    const handleGoBack = () => {
        router.back();
    };

    if (cartItems.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50">
                {/* Header */}
                <View className="bg-white px-5 py-4 border-b border-gray-100">
                    <View className="flex-row items-center">
                        <TouchableOpacity 
                            onPress={handleGoBack}
                            className="mr-3 w-10 h-10 items-center justify-center"
                        >
                            <Ionicons name="arrow-back" size={24} color="#374151" />
                        </TouchableOpacity>
                        <Text className="font-quicksandBold text-2xl text-gray-800">
                            Giỏ hàng
                        </Text>
                    </View>
                </View>
                
                <View className="flex-1 items-center justify-center px-5">
                    <Ionicons name="cart-outline" size={80} color="#D1D5DB" />
                    <Text className="font-quicksandBold text-xl text-gray-800 mt-4">
                        Giỏ hàng trống
                    </Text>
                    <Text className="font-quicksand text-sm text-gray-500 mt-2 text-center">
                        Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
                    </Text>
                    <TouchableOpacity 
                        onPress={() => router.push('/(tabs)')}
                        className="mt-6 bg-green-600 px-8 py-3 rounded-full"
                    >
                        <Text className="font-quicksandBold text-white text-base">
                            Mua sắm ngay
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white px-5 py-4 border-b border-gray-100">
                <View className="flex-row items-center">
                    <TouchableOpacity 
                        onPress={handleGoBack}
                        className="mr-3 w-10 h-10 items-center justify-center"
                    >
                        <Ionicons name="arrow-back" size={24} color="#374151" />
                    </TouchableOpacity>
                    <Text className="font-quicksandBold text-2xl text-gray-800">
                        Giỏ hàng ({totalItems})
                    </Text>
                </View>
            </View>

            {/* Cart Items */}
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-5 py-4">
                    {cartItems.map((item) => (
                        <View key={item.id} className="bg-white rounded-2xl p-4 mb-3 flex-row">
                            {/* Product Image */}
                            <Image 
                                source={{ uri: item.image }}
                                className="w-24 h-24 rounded-xl bg-gray-100"
                            />

                            {/* Product Info */}
                            <View className="flex-1 ml-4">
                                <Text className="font-quicksandBold text-base text-gray-800" numberOfLines={2}>
                                    {item.name}
                                </Text>
                                
                                <View className="flex-row mt-1">
                                    {item.size && (
                                        <Text className="font-quicksand text-xs text-gray-500 mr-3">
                                            Size: {item.size}
                                        </Text>
                                    )}
                                    {item.color && (
                                        <Text className="font-quicksand text-xs text-gray-500">
                                            Màu: {item.color}
                                        </Text>
                                    )}
                                </View>

                                <Text className="font-quicksandBold text-lg text-green-600 mt-2">
                                    {item.price.toLocaleString('vi-VN')}đ
                                </Text>

                                {/* Quantity Controls */}
                                <View className="flex-row items-center justify-between mt-2">
                                    <View className="flex-row items-center bg-gray-50 rounded-full">
                                        <TouchableOpacity 
                                            onPress={() => updateQuantity(item.id, -1)}
                                            className="w-8 h-8 items-center justify-center"
                                        >
                                            <Ionicons name="remove" size={18} color="#374151" />
                                        </TouchableOpacity>
                                        
                                        <Text className="font-quicksandSemiBold text-base text-gray-800 mx-3">
                                            {item.quantity}
                                        </Text>
                                        
                                        <TouchableOpacity 
                                            onPress={() => updateQuantity(item.id, 1)}
                                            className="w-8 h-8 items-center justify-center"
                                        >
                                            <Ionicons name="add" size={18} color="#374151" />
                                        </TouchableOpacity>
                                    </View>

                                    <TouchableOpacity 
                                        onPress={() => removeItem(item.id)}
                                        className="w-8 h-8 items-center justify-center"
                                    >
                                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Voucher Section */}
                <View className="px-5 pb-4">
                    <TouchableOpacity className="bg-white rounded-2xl p-4 flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                            <View className="w-10 h-10 bg-orange-50 rounded-full items-center justify-center mr-3">
                                <Ionicons name="pricetag" size={20} color="#F97316" />
                            </View>
                            <Text className="font-quicksandSemiBold text-base text-gray-800">
                                Chọn mã giảm giá
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Bottom Summary */}
            <View className="bg-white border-t border-gray-100 px-5 py-4">
                <View className="flex-row justify-between items-center mb-1">
                    <Text className="font-quicksand text-sm text-gray-600">
                        Tạm tính
                    </Text>
                    <Text className="font-quicksandSemiBold text-base text-gray-800">
                        {totalAmount.toLocaleString('vi-VN')}đ
                    </Text>
                </View>
                
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="font-quicksand text-sm text-gray-600">
                        Phí vận chuyển
                    </Text>
                    <Text className="font-quicksandSemiBold text-sm text-green-600">
                        Miễn phí
                    </Text>
                </View>

                <View className="h-px bg-gray-100 mb-4" />

                <View className="flex-row justify-between items-center mb-4">
                    <Text className="font-quicksandBold text-base text-gray-800">
                        Tổng cộng
                    </Text>
                    <Text className="font-quicksandBold text-xl text-green-600">
                        {totalAmount.toLocaleString('vi-VN')}đ
                    </Text>
                </View>

                <TouchableOpacity 
                    onPress={handleCheckout}
                    className="bg-green-600 py-4 rounded-full items-center"
                    activeOpacity={0.8}
                >
                    <Text className="font-quicksandBold text-white text-base">
                        Thanh toán
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}