import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order, DriverLocation, DeliveryRoute } from '../types/Order';
import MockDriverTrackingService from '../utils/MockDriverTrackingService';

import { mockOrders } from '../data/mockOrders';

// Function to safely handle notifications
const scheduleProximityNotification = async (orderId: string) => {
  try {
    // Dynamically import expo-notifications to avoid issues in Expo Go
    const { scheduleNotificationAsync } = await import('expo-notifications');
    await scheduleNotificationAsync({
      content: {
        title: "Driver Nearby!",
        body: `Your driver for order ${orderId} is almost there.`,
      },
      trigger: null,
    });
  } catch (e) {
    // expo-notifications is not available in Expo Go with SDK 53
    console.log("Notifications not available in Expo Go, skipping notification");
  }
};

interface OrdersState {
  orders: Order[];
  addOrder: (payload: { items: any[]; total: number }) => Promise<void>;
  clearOrders: () => void;
  initializeOrders: () => Promise<void>;
}

const ORDERS_STORAGE_KEY = 'village_marketplace_orders';

export const useOrdersStore = create<OrdersState>()((set, get) => ({
  orders: [],

  initializeOrders: async () => {
    try {
      const loaded = (await AsyncStorage.getItem(ORDERS_STORAGE_KEY)) as string | null;
      const loadedOrders = loaded ? JSON.parse(loaded) : [];

      if (loadedOrders.length === 0 && (globalThis as any).__DEV__) {
        // Seed mock orders for easier testing during development
        set({ orders: mockOrders });
        await AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(mockOrders));
      } else {
        set({ orders: loadedOrders });
      }
    } catch (e) {
      console.warn('Failed to load orders', e);
    }
  },

  addOrder: async (payload) => {
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

    set((state) => {
      const updatedOrders = [newOrder, ...state.orders];
      AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
      return { orders: updatedOrders };
    });

    // Start tracking if driver is assigned
    if (hasDriver) {
      const callback = (location: DriverLocation, route?: DeliveryRoute) => {
        set((state) => {
          const updatedOrders = state.orders.map((o) =>
            o.id === newOrder.id
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
          );
          return { orders: updatedOrders };
        });
      };
      trackingService.startTracking(callback);
    }
  },

  clearOrders: () => {
    set({ orders: [] });
    AsyncStorage.removeItem(ORDERS_STORAGE_KEY);
  },
}));

// Effect to save orders whenever they change (excluding initial load)
useOrdersStore.subscribe(
  (state, prevState) => {
    const orders = state.orders;
    const prevOrders = prevState.orders;
    if (orders !== prevOrders) {
      AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders)).catch((e) =>
        console.warn('Failed to save orders', e)
      );
    }
  }
);

// Effect to manage driver tracking subscriptions
const trackingCallbacks = new Map<string, (location: DriverLocation, route?: DeliveryRoute) => void>();
useOrdersStore.subscribe(
  (state, prevState) => {
    const orders = state.orders;
    const prevOrders = prevState.orders;
    const trackingService = MockDriverTrackingService.getInstance();
    const currentOrderIds = new Set(orders.map(o => o.id));

    // Stop tracking for removed/completed orders
    trackingCallbacks.forEach((callback, orderId) => {
      if (!currentOrderIds.has(orderId) || orders.find(o => o.id === orderId)?.status !== "on_way") {
        trackingService.stopTracking(callback);
        trackingCallbacks.delete(orderId);
      }
    });

    // Start tracking for new/active orders
    orders.forEach(order => {
      if (order.status === "on_way" && !trackingCallbacks.has(order.id)) {
        const callback = (location: DriverLocation, route?: DeliveryRoute) => {
          useOrdersStore.setState((state) => {
            const updatedOrders = state.orders.map((o) =>
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
            );
            return { orders: updatedOrders };
          });
        };
        trackingCallbacks.set(order.id, callback);
        trackingService.startTracking(callback);
      }
    });

    // Proximity notifications
    orders.forEach(order => {
      if (order.deliveryStatus === 'Out for Delivery' && order.driverLocation) {
        // The callback for tracking is already handled above, no need to re-call here

        // Check for proximity notification
        if (order.driverLocation && order.deliveryAddress?.latitude && order.deliveryAddress?.longitude) {
          const distance = MockDriverTrackingService.calculateDistance(
            { latitude: order.driverLocation.latitude, longitude: order.driverLocation.longitude },
            { latitude: order.deliveryAddress.latitude, longitude: order.deliveryAddress.longitude }
          );

          if (distance < 0.5 && !order.notifiedProximity) { // Less than 0.5 km
            // Schedule proximity notification if available
            scheduleProximityNotification(order.id);
            // Mark order as notified to prevent repeated notifications
            useOrdersStore.setState(state => ({
              orders: state.orders.map(o => o.id === order.id ? { ...o, notifiedProximity: true } : o)
            }));
          }
        }
      }
    });
  }
);
