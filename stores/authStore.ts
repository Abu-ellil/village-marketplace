import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

interface User {
  id: string;
  email: string;
  name: string;
  token: string; // JWT token
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

const USER_STORAGE_KEY = 'village_marketplace_user';
const TOKEN_STORAGE_KEY = 'village_marketplace_token';

// Configure axios to include the token in requests
axios.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isLoading: true,

  initializeAuth: async () => {
    set({ isLoading: true });
    try {
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        set({ user: { ...parsedUser, token: storedToken } });
      }
    } catch (e) {
      console.error('Failed to load user/token from storage', e);
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const { token, user: userData } = response.data;
      
      const newUser: User = { ...userData, token };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
      set({ user: newUser });
      return true;
    } catch (e: any) {
      console.error('Login failed', e.response?.data || e.message);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password });
      const { token, user: userData } = response.data;

      const newUser: User = { ...userData, token };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
      set({ user: newUser });
      return true;
    } catch (e: any) {
      console.error('Registration failed', e.response?.data || e.message);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      set({ user: null });
    } catch (e) {
      console.error('Logout failed', e);
    } finally {
      set({ isLoading: false });
    }
  },
}));
