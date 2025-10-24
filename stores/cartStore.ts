import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types/Product';
import { CartItem } from '../types/CartItem';

interface CartState {
  items: CartItem[];
  totalCount: number;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  changeQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  initializeCart: () => Promise<void>;
}

const CART_STORAGE_KEY = 'village_marketplace_cart_v1';

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  totalCount: 0,

  initializeCart: async () => {
    try {
      const raw = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const storedItems: CartItem[] = JSON.parse(raw);
        set({ items: storedItems, totalCount: storedItems.reduce((s, it) => s + it.quantity, 0) });
      }
    } catch (e) {
      console.warn('Failed to load cart from storage', e);
    }
  },

  addToCart: (product: Product) => {
    set((state) => {
      const existing = state.items.find((it) => String(it.product.id) === String(product.id));
      let newItems: CartItem[];
      if (existing) {
        newItems = state.items.map((it) =>
          String(it.product.id) === String(product.id) ? { ...it, quantity: it.quantity + 1 } : it
        );
      } else {
        const newItem: CartItem = {
          id: `cart-${product.id}`,
          product,
          quantity: 1,
        };
        newItems = [newItem, ...state.items];
      }
      AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
      return { items: newItems, totalCount: newItems.reduce((s, it) => s + it.quantity, 0) };
    });
  },

  removeFromCart: (id: string) => {
    set((state) => {
      const newItems = state.items.filter((it) => it.id !== id);
      AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
      return { items: newItems, totalCount: newItems.reduce((s, it) => s + it.quantity, 0) };
    });
  },

  changeQuantity: (id: string, qty: number) => {
    set((state) => {
      const newItems = state.items.map((it) => (it.id === id ? { ...it, quantity: qty } : it));
      AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
      return { items: newItems, totalCount: newItems.reduce((s, it) => s + it.quantity, 0) };
    });
  },

  clearCart: () => {
    set({ items: [], totalCount: 0 });
    AsyncStorage.removeItem(CART_STORAGE_KEY);
  },
}));
