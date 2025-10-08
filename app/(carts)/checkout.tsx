import React, { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function CheckoutScreen() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [note, setNote] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank'>('cod');

    const handlePlaceOrder = () => {
        if (!name || !phone || !address) {
            Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin giao hàng');
            return;
        }

        Alert.alert(
            'Đặt hàng thành công',
            'Cảm ơn bạn đã mua hàng! Chúng tôi sẽ liên hệ với bạn sớm nhất.',
            [
                { 
                    text: 'OK', 
                    onPress: () => router.push('/(tabs)')
                }
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white px-5 py-4 border-b border-gray-100">
                <View className="flex-row items-center">
                    <TouchableOpacity 
                        onPress={() => router.back()}
                        className="mr-3 w-10 h-10 items-center justify-center"
                    >
                        <Ionicons name="arrow-back" size={24} color="#374151" />
                    </TouchableOpacity>
                    <Text className="font-quicksandBold text-2xl text-gray-800">
                        Thanh toán
                    </Text>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Delivery Info */}
                <View className="bg-white mt-2 p-5">
                    <Text className="font-quicksandBold text-lg text-gray-800 mb-4">
                        Thông tin giao hàng
                    </Text>

                    <View className="mb-4">
                        <Text className="font-quicksandSemiBold text-sm text-gray-700 mb-2">
                            Họ và tên <Text className="text-red-500">*</Text>
                        </Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Nhập họ và tên"
                            className="bg-gray-50 px-4 py-3 rounded-xl font-quicksand text-base"
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="font-quicksandSemiBold text-sm text-gray-700 mb-2">
                            Số điện thoại <Text className="text-red-500">*</Text>
                        </Text>
                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Nhập số điện thoại"
                            keyboardType="phone-pad"
                            className="bg-gray-50 px-4 py-3 rounded-xl font-quicksand text-base"
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="font-quicksandSemiBold text-sm text-gray-700 mb-2">
                            Địa chỉ <Text className="text-red-500">*</Text>
                        </Text>
                        <TextInput
                            value={address}
                            onChangeText={setAddress}
                            placeholder="Nhập địa chỉ giao hàng"
                            multiline
                            numberOfLines={3}
                            className="bg-gray-50 px-4 py-3 rounded-xl font-quicksand text-base"
                            style={{ textAlignVertical: 'top' }}
                        />
                    </View>

                    <View>
                        <Text className="font-quicksandSemiBold text-sm text-gray-700 mb-2">
                            Ghi chú
                        </Text>
                        <TextInput
                            value={note}
                            onChangeText={setNote}
                            placeholder="Ghi chú cho đơn hàng (tùy chọn)"
                            multiline
                            numberOfLines={2}
                            className="bg-gray-50 px-4 py-3 rounded-xl font-quicksand text-base"
                            style={{ textAlignVertical: 'top' }}
                        />
                    </View>
                </View>

                {/* Payment Method */}
                <View className="bg-white mt-2 p-5">
                    <Text className="font-quicksandBold text-lg text-gray-800 mb-4">
                        Phương thức thanh toán
                    </Text>

                    <TouchableOpacity 
                        onPress={() => setPaymentMethod('cod')}
                        className={`flex-row items-center p-4 rounded-xl mb-3 ${
                            paymentMethod === 'cod' ? 'bg-green-50 border-2 border-green-600' : 'bg-gray-50'
                        }`}
                    >
                        <View className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 ${
                            paymentMethod === 'cod' ? 'border-green-600' : 'border-gray-300'
                        }`}>
                            {paymentMethod === 'cod' && (
                                <View className="w-3 h-3 rounded-full bg-green-600" />
                            )}
                        </View>
                        <Ionicons name="cash-outline" size={24} color="#374151" />
                        <Text className="font-quicksandSemiBold text-base text-gray-800 ml-3">
                            Thanh toán khi nhận hàng (COD)
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => setPaymentMethod('bank')}
                        className={`flex-row items-center p-4 rounded-xl ${
                            paymentMethod === 'bank' ? 'bg-green-50 border-2 border-green-600' : 'bg-gray-50'
                        }`}
                    >
                        <View className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 ${
                            paymentMethod === 'bank' ? 'border-green-600' : 'border-gray-300'
                        }`}>
                            {paymentMethod === 'bank' && (
                                <View className="w-3 h-3 rounded-full bg-green-600" />
                            )}
                        </View>
                        <Ionicons name="card-outline" size={24} color="#374151" />
                        <Text className="font-quicksandSemiBold text-base text-gray-800 ml-3">
                            Chuyển khoản ngân hàng
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Order Summary */}
                <View className="bg-white mt-2 p-5 mb-4">
                    <Text className="font-quicksandBold text-lg text-gray-800 mb-4">
                        Thông tin đơn hàng
                    </Text>

                    <View className="flex-row justify-between mb-2">
                        <Text className="font-quicksand text-sm text-gray-600">Tạm tính</Text>
                        <Text className="font-quicksandSemiBold text-sm text-gray-800">897.000đ</Text>
                    </View>

                    <View className="flex-row justify-between mb-2">
                        <Text className="font-quicksand text-sm text-gray-600">Phí vận chuyển</Text>
                        <Text className="font-quicksandSemiBold text-sm text-green-600">Miễn phí</Text>
                    </View>

                    <View className="h-px bg-gray-100 my-3" />

                    <View className="flex-row justify-between">
                        <Text className="font-quicksandBold text-base text-gray-800">Tổng cộng</Text>
                        <Text className="font-quicksandBold text-xl text-green-600">897.000đ</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Button */}
            <View className="bg-white border-t border-gray-100 px-5 py-4">
                <TouchableOpacity 
                    onPress={handlePlaceOrder}
                    className="bg-green-600 py-4 rounded-full items-center"
                    activeOpacity={0.8}
                >
                    <Text className="font-quicksandBold text-white text-base">
                        Đặt hàng
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}