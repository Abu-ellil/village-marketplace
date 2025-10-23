import React from "react";
import { View, ScrollView, Text } from "react-native";
import Header from "../components/Header";
import CartItem from "../components/CartItem";
import { ITEMS } from "../data/mockData";

export default function Cart() {
  // Placeholder cart items using first two items from mock data
  const cartItems = ITEMS.slice(0, 2).map((p) => ({
    id: `cart-${p.id}`,
    product: p,
    quantity: 1,
  }));

  const onRemove = (id: string) => {
    // Placeholder: implement state management later
    console.log("remove", id);
  };

  const onChangeQuantity = (id: string, qty: number) => {
    console.log("change qty", id, qty);
  };

  return (
    <View className="flex-1 bg-gray-100">
      <Header cartItemsCount={cartItems.length} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-xl font-bold mb-4">سلة التسوق</Text>
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onRemove={onRemove}
            onChangeQuantity={onChangeQuantity}
          />
        ))}
      </ScrollView>
    </View>
  );
}
