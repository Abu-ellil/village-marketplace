import React, { useEffect, useState, useCallback } from "react";
import { Slot, Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";
import { useOrdersStore } from "../stores/ordersStore";
import { useToastStore } from "../stores/toastStore";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { I18nManager, View, Text, StyleSheet, Animated } from "react-native";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

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

  if (!isVisible && opacity.__getValue() === 0) return null;

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

function AppContent() {
  const { user, isLoading } = useAuth();

  // Redirect to login if not authenticated and not loading
  if (!user && !isLoading) {
    return <Redirect href="/login" />;
  }

  // Show splash screen while authentication state is loading
  if (isLoading) {
    return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
  }

  return (
    <>
      <Slot />
      <Toast />
    </>
  );
}

export default function Layout() {
  const [ready, setReady] = useState(false);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const initializeCart = useCartStore((state) => state.initializeCart);
  const initializeOrders = useOrdersStore((state) => state.initializeOrders);

  const onLayoutRootView = useCallback(async () => {
    if (ready) {
      await SplashScreen.hideAsync();
    }
  }, [ready]);

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
        await initializeAuth(); // Initialize auth state from storage
        await initializeCart(); // Initialize cart state from storage
        await initializeOrders(); // Initialize orders state from storage
      } catch (e) {
        console.warn("Font loading or RTL setup failed:", e);
        // Still mark as ready to avoid hanging on splash screen
      } finally {
        setReady(true);
      }
    })();
  }, [initializeAuth, initializeCart, initializeOrders]);

  // keep splash until fonts/RTL are ready
  if (!ready) {
    return <View onLayout={onLayoutRootView} style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50" onLayout={onLayoutRootView}>
      
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      
    </SafeAreaView>
  );
}

