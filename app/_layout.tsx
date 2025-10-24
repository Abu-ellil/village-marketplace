import React, { useEffect, useState, useCallback } from "react";
import { Slot } from "expo-router";
import { CartProvider } from "../context/CartContext";
import { ToastProvider } from "../context/ToastContext";
import { OrdersProvider } from "../context/OrdersContext";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { I18nManager, View } from "react-native";

SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore if already prevented */
});

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
    <CartProvider>
      <OrdersProvider>
        <ToastProvider>
          <View className="flex-1 bg-neutral-50" onLayout={onLayoutRootView}>
            <Slot />
          </View>
        </ToastProvider>
      </OrdersProvider>
    </CartProvider>
  );
}
