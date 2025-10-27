import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ServerStatusIndicator from "./ServerStatusIndicator";
import Badge from "./ui/Badge";
import { useRouter } from "expo-router";
import { useCart } from "../context/CartContext";

const Header = ({ cartItemsCount }: { cartItemsCount?: number }) => {
  const router = useRouter();
  const { totalCount } = useCart();
  const displayCount = cartItemsCount !== undefined ? cartItemsCount : totalCount;

  return (
    <View className="bg-white border-b border-neutral-200 px-4 py-3 shadow-sm">
      <View className="flex-row justify-between items-center">
        <View className="items-center flex-1">
          <Text className="text-xl font-bold text-primary-dark">سوق القرية</Text>
          <Text className="text-sm text-neutral-500">بيع وشراء وخدمات محلية</Text>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.push('/cart')}
            className="mr-3"
          >
            <View className="relative">
              <Ionicons name="cart" size={28} color="#4B5563" />
              {displayCount > 0 && (
                <Badge count={displayCount} size={18} className="absolute -top-2 -right-2" />
              )}
            </View>
          </TouchableOpacity>
          <View className="ml-2">
            <ServerStatusIndicator size="small" />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Header;
