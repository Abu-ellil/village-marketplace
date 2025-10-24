import React, { useEffect, useState, useCallback } from "react";
import { Slot, Redirect } from "expo-router";
import { CartProvider } from "../context/CartContext";
import { ToastProvider } from "../context/ToastContext";
import { OrdersProvider } from "../context/OrdersContext";
import { AuthProvider, useAuth } from "../context/AuthContext";
import *s Font from "expo-font";
import *s SplashScreen from "expo-splash-screen";
import { I18nManager, View } from "react-native";

SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore if already prevented */
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
    <CartProvider>
      <OrdersProvider>
        <ToastProvider>
          <Slot />
        </ToastProvider>
      </OrdersProvider>
    </CartProvider>
  );
}

export default function Layout() {
  const [ready, setReady] = useState(false);

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
      } catch (e) {
        console.warn("Font loading or RTL setup failed:", e);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  // keep splash until fonts/RTL are ready
  if (!ready) {
    return <View onLayout={onLayoutRootView} style={{ flex: 1 }} />;
  }

  return (
    <AuthProvider>
      <View className="flex-1 bg-neutral-50" onLayout={onLayoutRootView}>
        <AppContent />
      </View>
    </AuthProvider>
  );
}
