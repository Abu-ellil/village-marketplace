import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useCategories, useProducts } from '../../app/lib/api';
import ProductCard from '../../components/ProductCard';
import SearchBar from '../../components/SearchBar';
import { Category } from '../../types/Category';
import { Product } from '../../types/Product';

export default function CategoryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: categories } = useCategories();
  const { data: products, isLoading } = useProducts();

  const category: Category | undefined = id === 'all'
    ? { id: 'all', name: 'الكل', icon: undefined }
    : categories?.find(cat => {
        // Handle cases where cat.id might be in a different format
        const catId = (cat as any)._id || cat.id;
        return catId === id;
      });
  const categoryProducts: Product[] = id === 'all'
    ? products || []
    : (products?.filter(product => {
        // Handle both string and object forms of category
        const productCategoryId = typeof product.category === 'object' && product.category !== null ?
          (product.category as any)._id || (product.category as any).id :
          product.category;
        return productCategoryId === id || product.categoryId === id;
      }) || []);

  if (!category) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text>Category not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <SearchBar value="" onChangeText={() => {}} />
        <View className="px-4 mt-4">
          <Text className="text-2xl font-bold mb-4">{category.name}</Text>
          <Text className="text-neutral-600 mb-6">
            {categoryProducts.length} products found
          </Text>
          
          <View className="space-y-4">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={() => {}} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}