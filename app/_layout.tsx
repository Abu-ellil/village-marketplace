import React, { useEffect, useState, useCallback } from "react";
import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";
import { useOrdersStore } from "../stores/ordersStore";
import { useToastStore } from "../stores/toastStore";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { I18nManager, View, Text, StyleSheet, Animated } from "react-native";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useColorScheme } from "nativewind";

SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore if already prevented */
});

const Toast = () => {
  const { message, isVisible, hide } = useToastStore();
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isVisible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, opacity]);

  if (!isVisible) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.container, { opacity }]}
    >
      <View style={styles.toast}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000, // Ensure toast is on top
  },
  toast: {
    backgroundColor: "rgba(0,0,0,0.85)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  text: {
    color: "#fff",
    textAlign: "center",
  },
});



const queryClient = new QueryClient();

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const { colorScheme } = useColorScheme();
  const [loaded] = Font.useFonts({
    Cairo: require('../assets/fonts/Cairo-Regular.ttf'),
  });
  const { user, isLoading } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        // Attempt to enable RTL. On native this may require a reload to take effect.
        I18nManager.allowRTL(true);
        try {
          I18nManager.forceRTL(true);
        } catch (e) {
          // ignore if not allowed at runtime
        }

        // Load app fonts (font file placed in ./assets/fonts/Cairo-Regular.ttf)
        await Font.loadAsync({
          Cairo: require("../assets/fonts/Cairo-Regular.ttf"),
        });
        
        // Use the store functions directly - they are stable
        const authStore = useAuthStore.getState();
        await authStore.initializeAuth(); // Initialize auth state from storage
        const cartStore = useCartStore.getState();
        await cartStore.initializeCart(); // Initialize cart state from storage
        const ordersStore = useOrdersStore.getState();
        await ordersStore.initializeOrders(); // Initialize orders state from storage
      } catch (e) {
        console.warn("Font loading or RTL setup failed:", e);
        // Still mark as ready to avoid hanging on splash screen
      } finally {
        setReady(true);
        // Hide splash screen when initialization is complete
        await SplashScreen.hideAsync();
      }
    })();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!ready || !loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <SafeAreaView className="flex-1 bg-neutral-50">
            {isLoading ? (
              <View style={{ flex: 1, backgroundColor: '#fff' }} />
            ) : user ? (
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="service/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="order/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="add" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="register" options={{ headerShown: false }} />
              </Stack>
            ) : (
              <Redirect href="/login" />
            )}
            <Toast />
          </SafeAreaView>
        </SafeAreaProvider>
    </QueryClientProvider>
  );
}

