import React, { createContext, useContext, useEffect, useState } from "react";
import { Order, DriverLocation, DeliveryRoute } from "../types/Order";
import { loadOrders, saveOrders } from "../utils/storage";
import { mockOrders } from "../data/mockOrders";
import MockDriverTrackingService from "../utils/MockDriverTrackingService";

type OrdersContextValue = {
  orders: Order[];
  addOrder: (payload: { items: any[]; total: number }) => Promise<void>;
  clearOrders: () => void;
};

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const trackingService = MockDriverTrackingService.getInstance();

  // Load saved orders (seed mock data in dev when empty)
  useEffect(() => {
    (async () => {
      try {
        const loaded = (await loadOrders()) as Order[] | null;
        const loadedOrders = loaded || [];

        if (loadedOrders.length === 0 && (globalThis as any).__DEV__) {
          // Seed mock orders for easier testing during development
          setOrders(mockOrders);
          await saveOrders(mockOrders as unknown as Order[]);
        } else {
          setOrders(loadedOrders);
        }
      } catch (e) {
        console.warn("Failed to load orders", e);
      }
    })();
  }, []);

  // Track active deliveries
  useEffect(() => {
    const trackingCallbacks = new Map();

    orders.forEach((order) => {
      if (order.status === "on_way" && order.driverLocation) {
        const callback = (location: DriverLocation, route?: DeliveryRoute) => {
          setOrders((prev) =>
            prev.map((o) =>
              o.id === order.id
                ? {
                    ...o,
                    driverLocation: location,
                    route,
                    lastEta: route
                      ? {
                          time: new Date().toISOString(),
                          remainingMinutes: Math.ceil(
                            route.estimatedDuration / 60
                          ),
                        }
                      : undefined,
                  }
                : o
            )
          );
        };

        trackingCallbacks.set(order.id, callback);
        trackingService.startTracking(callback);
      }
    });

    // Cleanup tracking on unmount
    return () => {
      orders.forEach((order) => {
        if (order.status === "on_way") {
          const callback = trackingCallbacks.get(order.id);
          if (callback) {
            trackingService.stopTracking(callback);
            trackingCallbacks.delete(order.id);
          }
        }
      });
    };
  }, [orders.map((o) => o.id).join(",")]); // Only re-run if order IDs change

  // Save orders whenever they change
  useEffect(() => {
    (async () => {
      try {
        await saveOrders(orders);
      } catch (e) {
        console.warn("Failed to save orders", e);
      }
    })();
  }, [orders]);

  const addOrder = async (payload: { items: any[]; total: number }) => {
    // For demo: simulate a delivery with driver location
    const hasDriver = Math.random() > 0.5;
    const trackingService = MockDriverTrackingService.getInstance();
    const initialLocation = hasDriver
      ? {
          latitude: 30.0444 + (Math.random() - 0.5) * 0.1,
          longitude: 31.2357 + (Math.random() - 0.5) * 0.1,
          timestamp: new Date().toISOString(),
          speed: 0,
        }
      : undefined;

    const newOrder: Order = {
      id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      items: payload.items,
      total: payload.total,
      createdAt: new Date().toISOString(),
      status: hasDriver ? "on_way" : "pending",
      // Demo driver data
      ...(hasDriver
        ? {
            driverName: "محمد علي",
            driverPhone: "01012345678",
            estimatedDeliveryTime: "45 دقيقة",
            driverLocation: initialLocation,
            route: undefined, // Will be set by tracking service
            lastEta: undefined, // Will be set by tracking service
          }
        : {}),
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const clearOrders = () => setOrders([]);

  return (
    <OrdersContext.Provider value={{ orders, addOrder, clearOrders }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = (): OrdersContextValue => {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
};

export default OrdersContext;
