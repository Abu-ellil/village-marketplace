import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "../types/Product";
import { useToast } from "../context/ToastContext";
import Button from "./ui/Button";
import { colors } from "../theme/colors";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { show: showToast } = useToast();

  const makeCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleAdd = () => {
    onAddToCart(product);
    showToast("تمت الإضافة إلى السلة");
  };

  return (
    <Card noPadding>
      <View className="aspect-square bg-neutral-100 items-center justify-center">
        <Text className="text-6xl">{product.image}</Text>
      </View>

      <View className="p-3">
        <Text
          className="text-lg font-bold text-neutral-900 mb-1"
          numberOfLines={1}
        >
          {product.name}
        </Text>

        <Text className="text-base font-bold text-primary mb-2">
          {product.price} جنيه
          <Text className="text-sm font-normal text-neutral-500">
            /{product.unit}
          </Text>
        </Text>

        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <Ionicons name="star" size={14} color={colors.warning} />
            <Text className="mr-1 text-sm text-warning font-medium">
              {product.rating}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="location" size={14} color={colors.neutral[400]} />
            <Text className="mr-1 text-sm text-neutral-500" numberOfLines={1}>
              {product.village}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center mb-3">
          <Ionicons name="person" size={14} color={colors.neutral[400]} />
          <Text className="mr-1 text-sm text-neutral-500" numberOfLines={1}>
            {product.seller}
          </Text>
        </View>

        <View className="flex-row justify-between gap-2">
          <Button
            accessibilityLabel={`Add ${product.name} to cart`}
            onPress={handleAdd}
            variant="primary"
            className="flex-1 py-2"
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="cart" size={18} color="white" />
              <Text className="text-white font-bold mr-1.5 text-sm">أضف</Text>
            </View>
          </Button>

          <Button
            accessibilityLabel={`Call ${product.seller}`}
            onPress={() => makeCall(product.phone)}
            variant="secondary"
            className="py-2"
          >
            <Ionicons name="call" size={18} color="white" />
          </Button>
        </View>
      </View>
    </View>
  );
};

export default ProductCard;
