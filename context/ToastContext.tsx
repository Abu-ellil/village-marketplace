import React, { createContext, useContext, useState, useCallback } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

type ToastContextValue = {
  show: (message: string, duration?: number) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<{ message: string } | null>(null);
  const [opacity] = useState(new Animated.Value(0));

  const show = useCallback(
    (message: string, duration = 1500) => {
      setToast({ message });
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(() => setToast(null));
        }, duration);
      });
    },
    [opacity]
  );

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast ? (
        <Animated.View
          pointerEvents="none"
          style={[styles.container, { opacity }]}
        >
          <View style={styles.toast}>
            <Text style={styles.text}>{toast.message}</Text>
          </View>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
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

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

export default ToastContext;
