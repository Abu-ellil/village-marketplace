import React from "react";
import { View, ScrollView, Text, RefreshControl } from "react-native";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import ProductCard from "../components/ProductCard";
import ServiceCard from "../components/ServiceCard";
import ShopBar from "../components/ShopBar";
import BottomNav from "../components/BottomNav";
import EmptyState from "../components/ui/EmptyState";
import {
  ProductCardSkeleton,
  ServiceCardSkeleton,
} from "../components/ui/CardSkeletons";
import { colors } from "../theme/colors";
import { CATEGORIES } from "../data/mockData";
import api from "./lib/api";
import { useCart } from "../context/CartContext";
import { Product } from "../types/Product";
import { Service } from "../types/Service";

export default function Market() {
  const [query, setQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null
  );
  const [selectedSeller, setSelectedSeller] = React.useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const { addToCart } = useCart();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [services, setServices] = React.useState<Service[]>([]);

  const fetchProductsAndServices = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedProducts = await api.getProducts();
      const fetchedServices = await api.getServices();
      setProducts(fetchedProducts);
      setServices(fetchedServices);
    } catch (err) {
      console.error('API fetch failed', err);
      // Fallback to mock data or display an error message
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchProductsAndServices();
  }, [fetchProductsAndServices]);

  // Build unique sellers list with optional image for each seller
  const sellerMap = new Map<string, string | null>();
  products.forEach((p) => {
    if (p.seller) {
      // prefer the first seen sellerImage for this seller
      if (!sellerMap.has(p.seller))
        sellerMap.set(p.seller, p.sellerImage || null);
    }
  });
  const sellers = Array.from(sellerMap.entries()).map(([name, image]) => ({
    name,
    image,
  }));

  const filteredProducts = products.filter(
    (p) =>
      (!selectedCategory || p.category === selectedCategory) &&
      (!selectedSeller || p.seller === selectedSeller) &&
      (p.name.toLowerCase().includes(query.toLowerCase()) ||
        (p.seller && p.seller.toLowerCase().includes(query.toLowerCase())))
  );

  const handleRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    await fetchProductsAndServices();
    setIsRefreshing(false);
  }, [fetchProductsAndServices]);

  return (
    <View className="flex-1 bg-neutral-50">
      <Header />

      <View className="flex-1">
        <SearchBar value={query} onChangeText={setQuery} />
        <CategoryFilter
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={(id) =>
            setSelectedCategory(id === selectedCategory ? null : id)
          }
        />
        <ShopBar
          sellers={sellers}
          selectedSeller={selectedSeller}
          onSelectSeller={(s) => setSelectedSeller(s)}
        />

        <ScrollView
          className="flex-"
          contentContainerStyle={{
            paddingBottom: 80, // Space for bottom nav
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary.DEFAULT}
            />
          }
        >
          {/* Products Section */}
          <View className="px-4">
            <View className="flex-row items-center justify-between py-3">
              <Text className="text-lg font-bold text-neutral-900">
                المنتجات
              </Text>
              <Text className="text-sm text-primary">
                {filteredProducts.length} منتج
              </Text>
            </View>

            {isLoading ? (
              <View className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((key) => (
                  <ProductCardSkeleton key={key} />
                ))}
              </View>
            ) : filteredProducts.length === 0 ? (
              <EmptyState
                title="لا توجد منتجات"
                subtitle={query ? "جرب البحث عن شيء آخر" : "اختر فئة أخرى"}
              />
            ) : (
              <View className="grid grid-cols-2 gap-3">
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={String(p.id)}
                    product={p}
                    onAddToCart={() => addToCart(p)}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Services Section */}
          <View className="mt-6 px-4">
            <View className="flex-row items-center justify-between py-3">
              <Text className="text-lg font-bold text-neutral-900">
                الخدمات المحلية
              </Text>
              <Text className="text-sm text-primary">
                {services.length} خدمة
              </Text>
            </View>

            {isLoading ? (
              <View className="gap-3">
                {[1, 2].map((key) => (
                  <ServiceCardSkeleton key={key} />
                ))}
              </View>
            ) : (
              <View className="gap-3">
                {services.map((s) => (
                  <ServiceCard key={s.id} service={s} />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      <BottomNav />
    </View>
  );
}
