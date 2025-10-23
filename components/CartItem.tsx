import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CartItem as CartItemType } from "../types/CartItem";
import Button from "./ui/Button";

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
  onChangeQuantity: (id: string, qty: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onRemove,
  onChangeQuantity,
}) => {
  return (
    <View className="bg-white rounded-lg p-3 my-2 flex-row items-center justify-between">
      <View className="flex-1">
        <Text className="text-lg font-bold">{item.product.name}</Text>
        <Text className="text-gray-600">
          {item.product.seller} - {item.product.village}
        </Text>
        <Text className="text-green-600 font-bold mt-1">
          {item.product.price} جنيه / {item.product.unit}
        </Text>
      </View>

      <View className="items-center">
        <View className="flex-row items-center mb-2">
          <Button
            accessibilityLabel={`Decrease quantity of ${item.product.name}`}
            onPress={() =>
              onChangeQuantity(item.id, Math.max(1, item.quantity - 1))
            }
            variant="ghost"
            className="px-2"
          >
            <Ionicons name="remove-circle" size={24} color="#4b5563" />
          </Button>

          <Text className="mx-2">{item.quantity}</Text>

          <Button
            accessibilityLabel={`Increase quantity of ${item.product.name}`}
            onPress={() => onChangeQuantity(item.id, item.quantity + 1)}
            variant="ghost"
            className="px-2"
          >
            <Ionicons name="add-circle" size={24} color="#4b5563" />
          </Button>
        </View>

        <Button
          accessibilityLabel={`Remove ${item.product.name} from cart`}
          onPress={() => onRemove(item.id)}
          variant="ghost"
          className="bg-red-500 px-3 py-1 rounded"
        >
          <Text className="text-white">إزالة</Text>
        </Button>
      </View>
    </View>
  );
};

export default CartItem;
