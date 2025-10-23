import React from "react";
import { View, ScrollView } from "react-native";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import ProductCard from "../components/ProductCard";
import ServiceCard from "../components/ServiceCard";
import {
  CATEGORIES,
  ITEMS as products,
  SERVICES as services,
} from "../data/mockData";
import { useCart } from "../context/CartContext";

export default function Market() {
  const [query, setQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null
  );

  const filteredProducts = products.filter(
    (p) =>
      (!selectedCategory || p.category === selectedCategory) &&
      (p.name.includes(query) || p.seller.includes(query))
  );
  const { addToCart } = useCart();

  return (
    <View className="flex-1 bg-gray-100">
      <Header />
      <SearchBar value={query} onChangeText={setQuery} />
      <CategoryFilter
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={(id) =>
          setSelectedCategory(id === selectedCategory ? null : id)
        }
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {filteredProducts.map((p) => (
          <ProductCard
            key={String(p.id)}
            product={p}
            onAddToCart={() => addToCart(p)}
          />
        ))}

        <View className="px-4 mt-4">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
