import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ITEMS as products } from "../../data/mockData";
import Header from "../../components/Header";
import Button from "../../components/ui/Button";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/helpers";
import ImageWithPlaceholder from "../../components/ui/ImageWithPlaceholder";

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const product = products.find((p) => String(p.id) === id);

  if (!product) {
    return (
      <View>
        <Header />
        <Text className="p-4 text-center">المنتج غير موجود</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Header />
      <ScrollView>
        <ImageWithPlaceholder
          className="w-full h-64"
          source={{ uri: product.image }}
        />
        <View className="p-4">
          <Text className="text-2xl font-bold mb-2">{product.name}</Text>
          <Text className="text-lg text-green-600 font-semibold mb-4">
            {formatCurrency(product.price)} / {product.unit}
          </Text>
          <Text className="text-base text-gray-700 mb-4">
            {product.description}
          </Text>
          <View className="border-t border-gray-200 pt-4">
            <Text className="text-lg font-semibold mb-2">معلومات البائع</Text>
            <View className="flex-row items-center">
              <ImageWithPlaceholder
                className="w-12 h-12 rounded-full mr-4"
                source={{ uri: product.sellerImage }}
              />
              <View>
                <Text className="text-base font-semibold">{product.seller}</Text>
                <Text className="text-sm text-gray-500">{product.village}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View className="p-4 border-t border-gray-200 bg-white">
        <Button
          onPress={() => addToCart(product)}
          variant="primary"
          className="w-full"
        >
          أضف إلى السلة
        </Button>
      </View>
    </View>
  );
}
