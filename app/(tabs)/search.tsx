import React, { useState, useMemo } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import ProductList from "@/components/product/ProductList";
import SearchBar from "@/components/search/SearchBar";
import { MOCK_PRODUCTS, CATEGORIES } from "@/constants/mockData";
import { Product, ProductCategory } from "@/types/product";
import { router } from 'expo-router';

export default function SearchScreen() {
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [products] = useState<Product[]>(MOCK_PRODUCTS);

    const filteredProducts = useMemo(() => {
        let filtered = products;
        if (selectedCategory !== 'all') filtered = filtered.filter(p => p.category === selectedCategory);
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
            );
        }
        return filtered;
    }, [products, selectedCategory, searchQuery]);

    const handleProductPress = (product: Product) => {
        router.push(`/(products)/${product.id}`);
    };

    const ListHeader = () => (
        <>
            {/* Category Filter */}
            <View className="bg-white py-4 border-b border-gray-100">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                    {CATEGORIES.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            onPress={() => setSelectedCategory(category.id as ProductCategory)}
                            className={`mr-3 px-5 py-2.5 rounded-full flex-row items-center ${
                                selectedCategory === category.id ? 'bg-green-600' : 'bg-gray-50'
                            }`}
                            activeOpacity={0.7}
                        >
                            <Text className="mr-1.5">{category.icon}</Text>
                            <Text className={`font-quicksandSemiBold text-sm ${selectedCategory === category.id ? 'text-white' : 'text-gray-700'}`}>
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Product Count */}
            <View className="px-5 py-3 bg-white">
                <Text className="font-quicksand text-sm text-gray-600">
                    {searchQuery.trim()
                        ? <>Tìm thấy <Text className="font-quicksandSemiBold text-green-600">{filteredProducts.length}</Text> kết quả cho "{searchQuery}"</>
                        : <>Tìm thấy <Text className="font-quicksandSemiBold text-green-600">{filteredProducts.length}</Text> sản phẩm</>}
                </Text>
            </View>
        </>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white px-5 py-4 border-b border-gray-100">
                <Text className="font-quicksandBold text-2xl text-gray-800 mb-3">Tìm kiếm sản phẩm</Text>
                <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
            </View>

            {/* List */}
            <ProductList
                products={filteredProducts}
                onProductPress={handleProductPress}
                ListHeaderComponent={<ListHeader />}
            />
        </SafeAreaView>
    );
}
