import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { colors } from "../theme/colors";
import Badge from "./ui/Badge";
import { useCart } from "../context/CartContext";

const NAV_ITEMS = [
  { name: "السوق", icon: "home", path: "/" },
  { name: "الخدمات", icon: "construct", path: "/services" },
  { name: "أضف منتج", icon: "add-circle", path: "/add" },
  { name: "السلة", icon: "cart", path: "/cart" },
  { name: "طلباتي", icon: "list", path: "/orders" },
] as const;

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { totalCount } = useCart();

  return (
    <View className="flex-row items-center justify-around bg-white border-t border-neutral-200 py-2 px-4">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.path;
        const showBadge = item.path === "/cart" && totalCount > 0;

        return (
          <TouchableOpacity
            key={item.path}
            onPress={() => router.push(item.path)}
            className="items-center py-1 px-3"
            accessibilityLabel={item.name}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <View className="relative">
              <Ionicons
                name={item.icon as any}
                size={24}
                color={isActive ? colors.primary.DEFAULT : colors.neutral[400]}
              />
              {showBadge && (
                <Badge count={totalCount} size={16} className="scale-75" />
              )}
            </View>
            <Text
              className={`text-xs mt-1 ${
                isActive ? "text-primary font-medium" : "text-neutral-400"
              }`}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
