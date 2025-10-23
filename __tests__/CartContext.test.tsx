import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { CartProvider, useCart } from "../context/CartContext";
import { Product } from "../types/Product";

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CartProvider>{children}</CartProvider>
);

const sampleProduct: Product = {
  id: "p-1",
  name: "اختبار",
  price: 10,
};

describe("CartContext", () => {
  it("adds item to cart and increases quantity on duplicate add", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleProduct);
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.totalCount).toBe(1);

    act(() => {
      result.current.addToCart(sampleProduct);
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.totalCount).toBe(2);
  });

  it("changes quantity and removes item", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleProduct);
    });

    const id = result.current.items[0].id;

    act(() => {
      result.current.changeQuantity(id, 5);
    });

    expect(result.current.items[0].quantity).toBe(5);

    act(() => {
      result.current.removeFromCart(id);
    });

    expect(result.current.items.length).toBe(0);
  });
});
