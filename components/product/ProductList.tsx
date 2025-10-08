import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { Product } from '@/types/product';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: Product[];
  onProductPress?: (product: Product) => void;
  ListHeaderComponent?: React.ReactElement;
}

const ProductList = ({ 
  products, 
  onProductPress,
  ListHeaderComponent 
}: ProductListProps) => {
  if (products.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <Text className="text-6xl mb-4">🌱</Text>
        <Text className="text-gray-600 font-quicksandSemiBold text-lg">
          Không tìm thấy sản phẩm
        </Text>
        <Text className="text-gray-400 font-quicksand text-sm mt-2">
          Hãy thử tìm kiếm với từ khóa khác
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ProductCard product={item} onPress={onProductPress} />
      )}
      numColumns={2}
      columnWrapperStyle={{ paddingHorizontal: 12 }}
      contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ListHeaderComponent}
    />
  );
};

export default ProductList;