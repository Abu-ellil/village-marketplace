import { useEffect } from "react";
import { Slot } from "expo-router";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";

export default function App() {
  return (
    <CartProvider>
      <ToastProvider>
        <Slot />
      </ToastProvider>
    </CartProvider>
  );
}
