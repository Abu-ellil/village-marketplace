import React, { createContext, useContext, ReactNode } from 'react';
import { useCartStore } from '../stores/cartStore';
import { useShallow } from 'zustand/react/shallow';

interface CartContextType {
  items: any[];
  totalCount: number;
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  changeQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  initializeCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const cartState = useCartStore(
    useShallow((state) => ({
      items: state.items,
      totalCount: state.totalCount,
      addToCart: state.addToCart,
      removeFromCart: state.removeFromCart,
      changeQuantity: state.changeQuantity,
      clearCart: state.clearCart,
      initializeCart: state.initializeCart,
    }))
  );

  return (
    <CartContext.Provider value={cartState}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
 if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
