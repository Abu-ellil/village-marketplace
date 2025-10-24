import AsyncStorage from "@react-native-async-storage/async-storage";

const CART_KEY = "village_marketplace_cart_v1";
const ORDERS_KEY = "village_marketplace_orders_v1";
const PREF_KEY = "village_marketplace_prefs_v1";

export const saveCart = async (cart: unknown[]) => {
  try {
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {
    console.warn("saveCart failed", e);
  }
};

export const loadCart = async (): Promise<unknown[]> => {
  try {
    const raw = await AsyncStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("loadCart failed", e);
    return [];
  }
};

export const saveOrders = async (orders: unknown[]) => {
  try {
    await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.warn("saveOrders failed", e);
  }
};

export const loadOrders = async (): Promise<unknown[]> => {
  try {
    const raw = await AsyncStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("loadOrders failed", e);
    return [];
  }
};

export const savePreferences = async (prefs: Record<string, unknown>) => {
  try {
    await AsyncStorage.setItem(PREF_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.warn("savePreferences failed", e);
  }
};

export const loadPreferences = async (): Promise<Record<string, unknown>> => {
  try {
    const raw = await AsyncStorage.getItem(PREF_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.warn("loadPreferences failed", e);
    return {};
  }
};

export default {
  saveCart,
  loadCart,
  saveOrders,
  loadOrders,
  savePreferences,
  loadPreferences,
};
