import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';
import { useToastStore } from './toastStore';

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
  loginWithPhone: (phone: string, password: string) => Promise<boolean>;
  register: (userData: { firstName: string; lastName: string; phone: string; email: string; password: string; coordinates: [number, number]; }) => Promise<boolean>;
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
      const { token, data: { user: userData } } = response.data;
      
      const newUser: User = { ...userData, token };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
      set({ user: newUser });
      useToastStore.getState().show('Login successful!');
      return true;
    } catch (e: any) {
      const errorData = e.response?.data;
      const errorMessage = errorData?.message || 'An unexpected error occurred.';
      
      // Provide more specific error messages for common scenarios
      let userFriendlyMessage = errorMessage;
      if (e.response?.status === 401) {
        userFriendlyMessage = errorData?.message || 'Invalid email or password.';
      } else if (e.response?.status === 404) {
        userFriendlyMessage = 'User not found.';
      } else if (e.response?.status === 429) {
        userFriendlyMessage = 'Too many login attempts. Please try again later.';
      }
      
      useToastStore.getState().show(userFriendlyMessage);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  
  loginWithPhone: async (phone, password) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { phone, password });
      const { token, data: { user: userData } } = response.data;
      
      const newUser: User = { ...userData, token };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
      set({ user: newUser });
      useToastStore.getState().show('Login successful!');
      return true;
    } catch (e: any) {
      const errorData = e.response?.data;
      const errorMessage = errorData?.message || 'An unexpected error occurred.';
      
      // Provide more specific error messages for common scenarios
      let userFriendlyMessage = errorMessage;
      if (e.response?.status === 401) {
        userFriendlyMessage = errorData?.message || 'Invalid phone number or password.';
      } else if (e.response?.status === 404) {
        userFriendlyMessage = 'User not found.';
      } else if (e.response?.status === 429) {
        userFriendlyMessage = 'Too many login attempts. Please try again later.';
      }
      
      useToastStore.getState().show(userFriendlyMessage);
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
      useToastStore.getState().show('Registration successful!');
      return true;
    } catch (e: any) {
      const errorData = e.response?.data;
      const errorMessage = errorData?.message || 'An unexpected error occurred.';
      console.error('Registration failed', errorData || e.message);
      
      // Provide more specific error messages for common scenarios
      let userFriendlyMessage = errorMessage;
      if (e.response?.status === 400) {
        userFriendlyMessage = errorData?.message || 'Invalid registration data.';
      } else if (e.response?.status === 409) {
        userFriendlyMessage = 'User already exists.';
      }
      
      useToastStore.getState().show(userFriendlyMessage);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  sendOTP: async (phone: string) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/send-otp`, { phoneNumber: phone });
      useToastStore.getState().show('OTP sent successfully!');
      return response.data.success;
    } catch (e: any) {
      const errorData = e.response?.data;
      const errorMessage = errorData?.message || 'An unexpected error occurred.';
      
      // Provide more specific error messages for common scenarios
      let userFriendlyMessage = errorMessage;
      if (e.response?.status === 429) {
        userFriendlyMessage = 'Too many requests. Please try again later.';
      } else if (e.response?.status === 400) {
        userFriendlyMessage = errorData?.message || 'Invalid phone number.';
      }
      
      useToastStore.getState().show(userFriendlyMessage);
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
      useToastStore.getState().show('OTP verified successfully!');
      return true;
    } catch (e: any) {
      const errorData = e.response?.data;
      const errorMessage = errorData?.message || 'An unexpected error occurred.';
      console.error('Verify OTP failed', errorData || e.message);
      
      // Provide more specific error messages for common scenarios
      let userFriendlyMessage = errorMessage;
      if (e.response?.status === 400) {
        userFriendlyMessage = errorData?.message || 'Invalid OTP code.';
      } else if (e.response?.status === 404) {
        userFriendlyMessage = 'User not found.';
      }
      
      useToastStore.getState().show(userFriendlyMessage);
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
      useToastStore.getState().show('Profile completed successfully!');
      return true;
    } catch (e: any) {
      const errorData = e.response?.data;
      const errorMessage = errorData?.message || 'An unexpected error occurred.';
      console.error('Complete profile failed', errorData || e.message);
      
      // Provide more specific error messages for common scenarios
      let userFriendlyMessage = errorMessage;
      if (e.response?.status === 400) {
        userFriendlyMessage = errorData?.message || 'Invalid profile data.';
      }
      
      useToastStore.getState().show(userFriendlyMessage);
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
      useToastStore.getState().show('Logged out successfully!');
    } catch (e) {
      console.error('Logout failed', e);
      useToastStore.getState().show('Logout failed. Please try again.');
    } finally {
      set({ isLoading: false });
    }
  },
}));
