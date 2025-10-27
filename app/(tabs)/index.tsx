import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Category } from '../../types/Category';
import { Product } from '../../types/Product';
import { useCategories, useProducts, useServices } from '../lib/api';
import { useCart } from '../../context/CartContext';
import CategoryFilter from '../../components/CategoryFilter';
import ProductCard from '../../components/ProductCard';
import ServiceCard from '../../components/ServiceCard';
import SearchBar from '../../components/SearchBar';
import ShopBar from '../../components/ShopBar';
import { FlashList } from '@shopify/flash-list';
import { ProductCardSkeleton, ServiceCardSkeleton } from '../../components/ui/CardSkeletons';
import FancyProductList from '../../components/FancyProductList'; // Import FancyProductList

export default function TabOneScreen() {
  const { data: products, isLoading: isLoadingProducts, isError: isErrorProducts } = useProducts();
  const { data: services, isLoading: isLoadingServices, isError: isErrorServices } = useServices();
  const { addToCart } = useCart();

  const [activeCategory, setActiveCategory] = useState<string | null>('all');
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);

  // Extract unique categories and sellers from products
  // Add "All" category option at the beginning
  const allCategory: Category = { id: 'all', name: 'الكل', icon: undefined };
  const productCategories = [
    allCategory,
    ...Array.from(
      new Map(
        (products && Array.isArray(products) ? products : [])
          .filter(p => p.category)
          .map(p => {
            // Handle both string and object forms of category
            const categoryId = typeof p.category === 'object' && p.category !== null ?
              (p.category as any)._id || (p.category as any).id :
              p.category;
            const categoryName = typeof p.category === 'object' && p.category !== null ?
              (p.category as any).name || (p.category as any).title :
              p.category;
              
            return [categoryId, {
              id: categoryId,
              name: categoryName,
              icon: undefined, // Explicitly set icon as undefined
            }];
          })
      ).values()
    ) as Category[]
  ];

   // Create unique sellers array using a Map to handle potential duplicates by name
   const allSellersMap = new Map<string, { name: string; image?: string; id: string }>();
   
   if (products && Array.isArray(products)) {
     products.forEach(p => {
       if (p.seller) {
         const key = `${p.seller}-${p.sellerId || p.id}`;
         if (!allSellersMap.has(key)) {
           allSellersMap.set(key, { name: p.seller, image: p.sellerImage, id: key });
         }
       }
     });
   }
   
   if (services && Array.isArray(services)) {
     services.forEach(s => {
       if (s.provider) {
         const key = `${s.provider}-${s.providerId || s.id}`;
         if (!allSellersMap.has(key)) {
           allSellersMap.set(key, { name: s.provider, image: s.providerImage, id: key });
         }
       }
     });
   }
   
   const allSellers = Array.from(allSellersMap.values());

  const filteredProducts = activeCategory && activeCategory !== 'all' && activeCategory !== null
    ? (products && Array.isArray(products) ? products.filter((product) => {
        // Handle both string and object forms of category
        const productCategoryId = typeof product.category === 'object' && product.category !== null ?
          (product.category as any)._id || (product.category as any).id :
          product.category;
        return productCategoryId === activeCategory;
      }) : [])
    : (products && Array.isArray(products) ? products : []);


  const productsToDisplay = selectedSeller
    ? (filteredProducts && Array.isArray(filteredProducts) ? filteredProducts.filter(product => product.seller === selectedSeller) : [])
    : filteredProducts;


  if (isLoadingProducts || isLoadingServices) {
    return (
      <View>
        <ProductCardSkeleton />
        <ServiceCardSkeleton />
      </View>
    );
  }

  if (isErrorProducts || isErrorServices) {
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
          categories={productCategories}
          selectedCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        <FancyProductList productsToDisplay={productsToDisplay} addToCart={addToCart} />
        
      </ScrollView>
    </SafeAreaView>
  );
}
