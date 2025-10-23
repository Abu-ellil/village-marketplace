import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "../types/Product";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const makeCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <View className="bg-white rounded-xl shadow-md p-4 m-2">
      <Text className="text-6xl text-center mb-4">{product.image}</Text>

      <Text className="text-xl font-bold mb-2">{product.name}</Text>

      <Text className="text-2xl font-bold text-green-600 mb-2">
        {product.price} جنيه / {product.unit}
      </Text>

      <View className="flex-row items-center mb-2">
        <Ionicons name="star" size={16} color="#eab308" />
        <Text className="mr-1 text-yellow-500">{product.rating}</Text>
      </View>

      <View className="flex-row items-center mb-2">
        <Ionicons name="person" size={16} color="#4b5563" />
        <Text className="mr-2 text-gray-600">{product.seller}</Text>
      </View>

      <View className="flex-row items-center mb-4">
        <Ionicons name="location" size={16} color="#4b5563" />
        <Text className="mr-2 text-gray-600">{product.village}</Text>
      </View>

      <View className="flex-row justify-between">
        <TouchableOpacity
          onPress={() => onAddToCart(product)}
          className="bg-green-600 px-4 py-2 rounded-lg flex-row items-center"
        >
          <Ionicons name="cart" size={20} color="white" />
          <Text className="text-white font-bold mr-2">أضف للسلة</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => makeCall(product.phone)}
          className="bg-blue-600 px-4 py-2 rounded-lg flex-row items-center"
        >
          <Ionicons name="call" size={20} color="white" />
          <Text className="text-white font-bold mr-2">اتصال</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductCard;
