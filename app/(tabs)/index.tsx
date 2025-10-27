import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { CATEGORIES } from '../../data/mockData';
import { Category } from '../../types/Category';
import { Product } from '../../types/Product';
import { Service } from '../../types/Service';
import { useCategories, useProducts, useServices } from '../lib/api';
import CategoryFilter from '../../components/CategoryFilter';
import ProductCard from '../../components/ProductCard';
import ServiceCard from '../../components/ServiceCard';
import SearchBar from '../../components/SearchBar';
import ShopBar from '../../components/ShopBar';
import { FlashList } from '@shopify/flash-list';
import { ProductCardSkeleton, ServiceCardSkeleton } from '../../components/ui/CardSkeletons';

export default function TabOneScreen() {
  const { data: products, isLoading: isLoadingProducts, isError: isErrorProducts } = useProducts();
  const { data: services, isLoading: isLoadingServices, isError: isErrorServices } = useServices();
  const { data: categories, isLoading: isLoadingCategories, isError: isErrorCategories } = useCategories();

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);

  const allSellers = Array.from(new Set([
    ...(products && Array.isArray(products) ? products.map(p => ({ name: p.seller, image: p.sellerImage })) : []),
    ...(services && Array.isArray(services) ? services.map(s => ({ name: s.provider, image: s.providerImage })) : []),
  ])).map(seller => seller);

  const filteredProducts = activeCategory
    ? (products && Array.isArray(products) ? products.filter((product) => product.category === activeCategory) : [])
    : (products && Array.isArray(products) ? products : []);

  const filteredServices = activeCategory
    ? (services && Array.isArray(services) ? services.filter((service) => service.category === activeCategory) : [])
    : (services && Array.isArray(services) ? services : []);

  const productsToDisplay = selectedSeller
    ? (filteredProducts && Array.isArray(filteredProducts) ? filteredProducts.filter(product => product.seller === selectedSeller) : [])
    : filteredProducts;

  const servicesToDisplay = selectedSeller
    ? (filteredServices && Array.isArray(filteredServices) ? filteredServices.filter(service => service.provider === selectedSeller) : [])
    : filteredServices;

  if (isLoadingProducts || isLoadingServices || isLoadingCategories) {
    return (
      <View>
        <ProductCardSkeleton />
        <ServiceCardSkeleton />
      </View>
    );
  }

  if (isErrorProducts || isErrorServices || isErrorCategories) {
    return <Text>Error loading data.</Text>;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <SearchBar value="" onChangeText={() => {}} />
        <ShopBar
          sellers={allSellers || []}
          selectedSeller={selectedSeller}
          onSelectSeller={setSelectedSeller}
        />
        <CategoryFilter
          categories={categories && Array.isArray(categories) ? categories : CATEGORIES}
          selectedCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        <View className="mt-4">
          <Text className="text-xl font-bold px-4 mb-2">Products ({productsToDisplay?.length || 0})</Text>
          <FlashList
            data={productsToDisplay || []}
            renderItem={({ item }) => <ProductCard product={item} onAddToCart={() => {}} />}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View className="mt-4">
          <Text className="text-xl font-bold px-4 mb-2">Services ({servicesToDisplay?.length || 0})</Text>
          <FlashList
            data={servicesToDisplay || []}
            renderItem={({ item }) => <ServiceCard service={item} />}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
