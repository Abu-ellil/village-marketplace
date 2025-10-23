import React from "react";
import { View, ScrollView, Text } from "react-native";
import Header from "../components/Header";
import CartItem from "../components/CartItem";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, removeFromCart, changeQuantity } = useCart();

  return (
    <View className="flex-1 bg-gray-100">
      <Header />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-xl font-bold mb-4">سلة التسوق</Text>
        {items.length === 0 && <Text>السلة فارغة</Text>}
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onRemove={removeFromCart}
            onChangeQuantity={changeQuantity}
          />
        ))}
      </ScrollView>
    </View>
  );
}
