import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order, DriverLocation, DeliveryRoute } from '../types/Order';

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

      set({ orders: loadedOrders });
    } catch (e) {
      console.warn('Failed to load orders', e);
    }
  },

  addOrder: async (payload) => {
    const newOrder: Order = {
      id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      items: payload.items,
      total: payload.total,
      createdAt: new Date().toISOString(),
      status: "pending", // Default to pending until backend provides actual status
      // Driver information will be added when the backend provides it
    };

    set((state) => {
      const updatedOrders = [newOrder, ...state.orders];
      AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
      return { orders: updatedOrders };
    });
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

// Effect to manage driver tracking subscriptions - removed mock tracking
useOrdersStore.subscribe(
  (state, prevState) => {
    const orders = state.orders;
    const prevOrders = prevState.orders;
    
    // Proximity notifications
    orders.forEach(order => {
      if (order.status === 'on_way' && order.driverLocation) {
        // Check for proximity notification
        if (order.driverLocation && order.deliveryAddress?.latitude && order.deliveryAddress?.longitude) {
          // Calculate distance using basic formula
          const R = 6371e3; // Earth's radius in meters
          const φ1 = (order.driverLocation.latitude * Math.PI) / 180;
          const φ2 = (order.deliveryAddress.latitude * Math.PI) / 180;
          const Δφ = ((order.deliveryAddress.latitude - order.driverLocation.latitude) * Math.PI) / 180;
          const Δλ = ((order.deliveryAddress.longitude - order.driverLocation.longitude) * Math.PI) / 180;

          const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

          const distance = R * c; // Distance in meters

          if (distance < 500 && !order.notifiedProximity) { // Less than 50 meters
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
