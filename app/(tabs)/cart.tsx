import React from "react";
import { View, ScrollView, Text } from "react-native";
import Header from "../../components/Header";
import CartItem from "../../components/CartItem";
import { useCart } from "../../context/CartContext";
import { useOrders } from "../../context/OrdersContext";
import Button from "../../components/ui/Button";
import { useToast } from "../../context/ToastContext";
import { formatCurrency } from "../../utils/helpers";
import { useRouter } from "expo-router";

export default function Cart() {
  const { items, removeFromCart, changeQuantity, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { show } = useToast();
  const router = useRouter();

  const total = items.reduce(
    (s, it) => s + (it.product.price || 0) * it.quantity,
    0
  );

  const handleCheckout = async () => {
    if (items.length === 0) {
      show("السلة فارغة");
      return;
    }

    try {
      await addOrder({ items, total });
      clearCart();
      show("تم إنشاء الطلب");
      router.push("/orders");
    } catch (e) {
      console.warn("checkout failed", e);
      show("فشل إنشاء الطلب");
    }
  };

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

        <View className="mt-6">
          <Text className="text-lg font-semibold mb-3">
            المجموع:{" "}
            <Text className="text-green-600">{formatCurrency(total)}</Text>
          </Text>
          <Button onPress={handleCheckout} variant="primary" className="w-full">
            إتمام الطلب
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
