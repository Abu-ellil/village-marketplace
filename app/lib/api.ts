import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import Category from '../../types/Category';
import { Product } from '../../types/Product';
import Service from '../../types/Service';
import { API_BASE_URL } from '../../utils/config';

// ============================================================================
// Configuration
// ============================================================================

const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

// ============================================================================
// API Client Setup
// ============================================================================

class ApiClient {
  private client: AxiosInstance;
  private isProduction: boolean;

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.client = axios.create(API_CONFIG);
    this.setupInterceptors();
    
    if (!this.isProduction) {
      console.log('🔧 API Client initialized:', API_CONFIG.baseURL);
    }
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (!this.isProduction) {
          console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
      },
      (error: AxiosError) => {
        console.error('❌ Request Error:', error.message);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        if (!this.isProduction) {
          console.log(`✅ ${response.status} ${response.config.url}`);
        }
        return response;
      },
      (error: AxiosError) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  private handleError(error: AxiosError): void {
    if (error.response) {
      // Server responded with error status
      console.error(`❌ API Error ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('❌ No response from server:', error.message);
      console.error('💡 Check that:');
      console.error('   - API server is running');
      console.error('   - API_BASE_URL is correct:', API_CONFIG.baseURL);
      console.error('   - You are using your computer\'s IP (not localhost) for mobile devices');
    } else {
      // Request setup error
      console.error('❌ Request Error:', error.message);
    }
  }

  public getClient(): AxiosInstance {
    return this.client;
  }

  public async healthCheck(): Promise<boolean> {
    try {
      // Use /products instead since /health doesn't exist
      const response = await this.client.get('/products', { timeout: 10000 });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}

// Singleton instance
const apiClient = new ApiClient();
export const api = apiClient.getClient();

// ============================================================================
// API Response Types
// ============================================================================

interface ApiResponse<T> {
  data?: T;
  results?: T;
  message?: string;
  success?: boolean;
}

// Helper to extract data from various response formats
const extractData = <T>(response: ApiResponse<T>): T => {
  return response.results || response.data || (response as unknown as T);
};

// ============================================================================
// API Service Functions
// ============================================================================

export const productsService = {
  getAll: async (): Promise<Product[]> => {
    const { data } = await api.get<ApiResponse<Product[]>>('/products');
    return extractData(data);
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return extractData(data);
  },
};

export const servicesService = {
  getAll: async (): Promise<Service[]> => {
    const { data } = await api.get<ApiResponse<Service[]>>('/services');
    return extractData(data);
  },

  getById: async (id: string): Promise<Service> => {
    const { data } = await api.get<ApiResponse<Service>>(`/services/${id}`);
    return extractData(data);
  },
};

export const categoriesService = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.get<ApiResponse<Category[]>>('/categories');
    return extractData(data);
  },
};

// ============================================================================
// React Query Hooks with Better Configuration
// ============================================================================

const DEFAULT_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  retry: 2,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
} as const;

export const useProducts = (options?: Partial<UseQueryOptions<Product[], Error>>) => {
  return useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: productsService.getAll,
    ...DEFAULT_QUERY_OPTIONS,
    ...options,
  });
};

export const useProductById = (
  id: string,
  options?: Partial<UseQueryOptions<Product, Error>>
) => {
  return useQuery<Product, Error>({
    queryKey: ['product', id],
    queryFn: () => productsService.getById(id),
    enabled: !!id,
    ...DEFAULT_QUERY_OPTIONS,
    ...options,
  });
};

export const useServices = (options?: Partial<UseQueryOptions<Service[], Error>>) => {
  return useQuery<Service[], Error>({
    queryKey: ['services'],
    queryFn: servicesService.getAll,
    ...DEFAULT_QUERY_OPTIONS,
    ...options,
  });
};

export const useServiceById = (
  id: string,
  options?: Partial<UseQueryOptions<Service, Error>>
) => {
  return useQuery<Service, Error>({
    queryKey: ['service', id],
    queryFn: () => servicesService.getById(id),
    enabled: !!id,
    ...DEFAULT_QUERY_OPTIONS,
    ...options,
  });
};

export const useCategories = (options?: Partial<UseQueryOptions<Category[], Error>>) => {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: categoriesService.getAll,
    staleTime: 10 * 60 * 1000, // Categories change less frequently
    ...DEFAULT_QUERY_OPTIONS,
    ...options,
  });
};

// ============================================================================
// Connectivity Utilities
// ============================================================================

interface ConnectivityResult {
  isConnected: boolean;
  endpoints: {
    name: string;
    status: 'success' | 'failed';
    statusCode?: number;
    itemCount?: number;
    error?: string;
  }[];
  timestamp: Date;
}

export const checkServerConnectivity = async (): Promise<boolean> => {
  const result = await getDetailedConnectivity();
  
 
  
  result.endpoints.forEach(endpoint => {
    const icon = endpoint.status === 'success' ? '✅' : '❌';
    const details = endpoint.status === 'success'
      ? `(${endpoint.statusCode}, ${endpoint.itemCount} items)`
      : `(${endpoint.error})`;
   
  });
  
 
  
  if (!result.isConnected) {
    
  }
  
  return result.isConnected;
};

export const getDetailedConnectivity = async (): Promise<ConnectivityResult> => {
  const result: ConnectivityResult = {
    isConnected: false,
    endpoints: [],
    timestamp: new Date(),
  };

  const testEndpoints = [
    { name: 'Products', path: '/products', critical: true },
    { name: 'Services', path: '/services', critical: false },
    { name: 'Categories', path: '/categories', critical: false },
  ];

  for (const endpoint of testEndpoints) {
    try {
      const response = await api.get(endpoint.path, { timeout: 10000 });
      const itemCount = response.data.results?.length || response.data?.length || 0;
      
      result.endpoints.push({
        name: endpoint.name,
        status: 'success',
        statusCode: response.status,
        itemCount,
      });

      if (endpoint.critical) {
        result.isConnected = true;
      }
    } catch (error: any) {
      result.endpoints.push({
        name: endpoint.name,
        status: 'failed',
        error: error.message || 'Unknown error',
      });
    }
  }

  return result;
};

// ============================================================================
// Utility Exports
// ============================================================================

export { apiClient };

export default api;