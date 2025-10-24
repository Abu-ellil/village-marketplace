import React, { useEffect } from "react";
import { View, Animated, Easing, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

interface ShimmerProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  className?: string;
}

export default function Shimmer({
  width = "100%",
  height = 20,
  borderRadius = 4,
  className = "",
}: ShimmerProps) {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.6, 0.3],
  });

  const containerStyle: any = {
    height,
    borderRadius,
    backgroundColor: colors.neutral[200],
  };
  if (typeof width === "number") containerStyle.width = width;
  else if (typeof width === "string" && width !== "100%")
    containerStyle.width = width;

  return (
    <View className={`overflow-hidden ${className}`} style={containerStyle}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: colors.neutral[100], opacity },
          styles.shimmer,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  shimmer: {
    width: "100%",
    opacity: 0.3,
  },
});
