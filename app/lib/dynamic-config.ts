import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Smart API URL configuration that automatically adapts to your environment
 * No need to manually change URLs for different devices!
 */
const getApiBaseUrl = (): string => {
  // Check for explicit environment variable first
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  
  if (envUrl) {
    console.log('📍 Using API URL from .env:', envUrl);
    return envUrl;
  }

  // In production, you must set the env variable
  if (!__DEV__) {
    throw new Error('EXPO_PUBLIC_API_BASE_URL must be set in production');
  }

  // Development mode - auto-detect based on platform
  console.log('🔧 Development mode - auto-detecting API URL');
  
  // Android Emulator uses special IP
  if (Platform.OS === 'android') {
    const androidUrl = 'http://10.0.2.2:5000/api/v1';
    console.log('📱 Android emulator detected:', androidUrl);
    return androidUrl;
  }

  // iOS Simulator can use localhost
  if (Platform.OS === 'ios') {
    const iosUrl = 'http://localhost:5000/api/v1';
    console.log('📱 iOS simulator detected:', iosUrl);
    return iosUrl;
  }

  // Physical devices - try to get IP from Expo debugger host
  try {
    const debuggerHost = Constants.expoConfig?.hostUri?.split(':').shift();
    
    if (debuggerHost) {
      const deviceUrl = `http://${debuggerHost}:5000/api/v1`;
      console.log('📱 Physical device detected:', deviceUrl);
      return deviceUrl;
    }
  } catch (error) {
    console.warn('⚠️ Could not auto-detect IP:', error);
  }

  // Fallback to localhost
  const fallbackUrl = 'http://localhost:5000/api/v1';
  console.log('⚠️ Using fallback URL:', fallbackUrl);
  console.log('💡 If this doesn\'t work, set EXPO_PUBLIC_API_BASE_URL in .env');
  
  return fallbackUrl;
};

export const API_BASE_URL = getApiBaseUrl();

// Export for debugging
export const getDebugInfo = () => ({
  apiBaseUrl: API_BASE_URL,
  platform: Platform.OS,
  isDev: __DEV__,
  expoConfig: Constants.expoConfig?.hostUri,
});