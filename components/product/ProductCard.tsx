import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
}

const ProductCard = ({ product, onPress }: ProductCardProps) => {
  const renderSustainabilityStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <Text key={index} className="text-xs">
        {index < product.sustainability ? '🌿' : '🤍'}
      </Text>
    ));
  };

  return (
    <TouchableOpacity
      onPress={() => onPress?.(product)}
      className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden mx-1 mb-4"
      activeOpacity={0.7}
    >
      {/* Image Container */}
      <View className="relative">
        <Image
          source={{ uri: product.image }}
          className="w-full h-44"
          resizeMode="cover"
        />
        
        {/* Stock Badge */}
        {!product.inStock && (
          <View className="absolute top-2 right-2 bg-red-500 px-2 py-1 rounded-full">
            <Text className="text-white text-xs font-quicksandSemiBold">
              Hết hàng
            </Text>
          </View>
        )}

        {/* Condition Badge */}
        {product.condition && (
          <View className="absolute top-2 left-2 bg-green-600 px-2 py-1 rounded-full">
            <Text className="text-white text-xs font-quicksandSemiBold">
              {product.condition === 'new' ? 'Mới' : 
               product.condition === 'like-new' ? 'Như mới' : 
               product.condition === 'good' ? 'Tốt' : 'Khá'}
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View className="p-3">
        {/* Product Name */}
        <Text 
          className="font-quicksandBold text-sm text-gray-800 mb-1"
          numberOfLines={2}
        >
          {product.name}
        </Text>

        {/* Sustainability Rating */}
        <View className="flex-row items-center mb-2">
          {renderSustainabilityStars()}
        </View>

        {/* Price */}
        <View className="flex-row items-center justify-between">
          <Text className="font-quicksandBold text-base text-green-600">
            {product.price.toLocaleString('vi-VN')}đ
          </Text>
          
          <TouchableOpacity className="w-8 h-8 bg-green-50 rounded-full items-center justify-center">
            <Ionicons name="heart-outline" size={18} color="#16A34A" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;