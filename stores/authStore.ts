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
  register: (userData: { name: string; phone: string; email?: string; villageId: string; address?: string; bio?: string; coordinates: [number, number]; }) => Promise<boolean>;
  sendOTP: (phone: string) => Promise<boolean>;
  verifyOTP: (phone: string, otp: string) => Promise<boolean>;
  completeProfile: (profileData: any) => Promise<boolean>;
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

  register: async (userData) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      const { token, user: userDataResponse } = response.data;

      const newUser: User = { ...userDataResponse, token };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userDataResponse));
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

  sendOTP: async (phone: string) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/send-otp`, { phoneNumber: phone });
      return response.data.success;
    } catch (e: any) {
      console.error('Send OTP failed', e.response?.data || e.message);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  verifyOTP: async (phone: string, otp: string) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, { phoneNumber: phone, otp });
      const { token, user: userData } = response.data.data;

      const newUser: User = { ...userData, token };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
      set({ user: newUser });
      return true;
    } catch (e: any) {
      console.error('Verify OTP failed', e.response?.data || e.message);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  completeProfile: async (profileData: any) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/complete-profile`, profileData);
      const { user: userData } = response.data.data;

      // Update stored user data
      const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      if (storedToken) {
        const updatedUser: User = { ...userData, token: storedToken };
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        set({ user: updatedUser });
      }
      return true;
    } catch (e: any) {
      console.error('Complete profile failed', e.response?.data || e.message);
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
