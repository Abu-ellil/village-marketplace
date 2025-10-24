import { useEffect } from "react";
import { Slot } from "expo-router";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import { SafeAreaView } from "react-native";

export default function App() {
  return (

    <SafeAreaView>

    <CartProvider>
      <ToastProvider>
        <Slot />
      </ToastProvider>
    </CartProvider>
    </SafeAreaView>
  );
}
