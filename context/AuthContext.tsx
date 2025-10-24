import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

interface User {
  id: string;
  email: string;
  name: string;
  token: string; // JWT token
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
        const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser);
          setUser({ ...parsedUser, token: storedToken });
        }
      } catch (e) {
        console.error('Failed to load user/token from storage', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const { token, user: userData } = response.data;
      
      const newUser: User = { ...userData, token };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
      setUser(newUser);
      return true;
    } catch (e: any) {
      console.error('Login failed', e.response?.data || e.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password });
      const { token, user: userData } = response.data;

      const newUser: User = { ...userData, token };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
      setUser(newUser);
      return true;
    } catch (e: any) {
      console.error('Registration failed', e.response?.data || e.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      setUser(null);
    } catch (e) {
      console.error('Logout failed', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
