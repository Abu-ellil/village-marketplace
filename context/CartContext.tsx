import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Product } from '../types/Product';
import type { CartItem } from '../types/CartItem';

type CartContextValue = {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  changeQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  totalCount: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_KEY = 'village_marketplace_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(CART_KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch (e) {
        console.warn('Failed to load cart from storage', e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(CART_KEY, JSON.stringify(items));
      } catch (e) {
        console.warn('Failed to save cart to storage', e);
      }
    })();
  }, [items]);

  const addToCart = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((it) => String(it.product.id) === String(product.id));
      if (existing) {
        return prev.map((it) =>
          String(it.product.id) === String(product.id) ? { ...it, quantity: it.quantity + 1 } : it
        );
      }
      const newItem: CartItem = {
        id: `cart-${product.id}`,
        product,
        quantity: 1,
      };
      return [newItem, ...prev];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const changeQuantity = (id: string, qty: number) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, quantity: qty } : it)));
  };

  const clearCart = () => setItems([]);

  const totalCount = items.reduce((s, it) => s + it.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, changeQuantity, clearCart, totalCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};

export default CartContext;
