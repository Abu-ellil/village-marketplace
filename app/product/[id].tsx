import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "../../components/Header";
import Button from "../../components/ui/Button";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/helpers";
import ImageWithPlaceholder from "../../components/ui/ImageWithPlaceholder";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import StarRating from "../../components/ui/StarRating";
import * as api from "../../app/lib/api";
import { Product } from "../../types/Product";

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const fetchedProduct = await api.getProductById(String(id));
        setProduct(fetchedProduct);
      } catch (error) {
        console.error("Failed to fetch product", error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      </View>
    );
  }

  if (!product) {
    return (
      <View>
        <Header />
        <Text className="p-4 text-center">المنتج غير موجود</Text>
      </View>
    );
  }

  const averageRating = product.reviews && product.reviews.length > 0
    ? (product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length)
    : product.rating || 0;
  const numberOfReviews = product.reviews ? product.reviews.length : 0;

  return (
    <View className="flex-1 bg-white">
      <Header />
      <ScrollView>
        <ImageWithPlaceholder
          className="w-full h-64"
          uri={product.image}
        />
        <View className="p-4">
          <Text className="text-2xl font-bold mb-2">{product.name}</Text>

          <View className="flex-row items-center mb-2">
            <StarRating
              rating={averageRating}
              size={18}
              showNumber={true}
              totalReviews={numberOfReviews}
            />
          </View>

          <Text className="text-lg text-green-600 font-semibold mb-4">
            {formatCurrency(product.price)} / {product.unit}
          </Text>
          <Text className="text-base text-gray-700 mb-4">
            {product.description}
          </Text>

          {/* Seller Info */}
          <View className="border-t border-gray-200 pt-4">
            <Text className="text-lg font-semibold mb-2">معلومات البائع</Text>
            <View className="flex-row items-center">
              <ImageWithPlaceholder
                className="w-12 h-12 rounded-full mr-4"
                uri={product.sellerImage}
              />
              <View>
                <Text className="text-base font-semibold">{product.seller}</Text>
                <Text className="text-sm text-gray-500">{product.village}</Text>
              </View>
            </View>
          </View>

          {/* Reviews Section */}
          {numberOfReviews > 0 && (
            <View className="border-t border-gray-200 pt-4 mt-4">
              <Text className="text-lg font-semibold mb-3">التقييمات ({numberOfReviews})</Text>
              {product.reviews?.map((review) => (
                <View key={review.id} className="bg-gray-50 p-3 rounded-lg mb-3">
                  <View className="flex-row items-center mb-1">
                    <StarRating rating={review.rating} size={14} showNumber={true} />
                    <Text className="text-sm text-neutral-500">بواسطة {review.reviewerName}</Text>
                  </View>
                  <Text className="text-gray-700 mb-1">{review.comment}</Text>
                  <Text className="text-xs text-neutral-400">
                    {new Date(review.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </Text>
                </View>
              ))}
            </View>
          )}
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
