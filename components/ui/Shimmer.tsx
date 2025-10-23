import React, { useEffect } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface ShimmerProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  className?: string;
}

export default function Shimmer({ 
  width = '100%',
  height = 20,
  borderRadius = 4,
  className = ''
}: ShimmerProps) {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true
        })
      ])
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width]
  });

  return (
    <View 
      className={`overflow-hidden ${className}`}
      style={[{ width, height, borderRadius, backgroundColor: colors.neutral[200] }]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ translateX }],
            backgroundColor: colors.neutral[100],
          },
          styles.shimmer
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  shimmer: {
    width: '100%',
    opacity: 0.3
  },
});