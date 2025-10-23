import React from "react";
import { View, Text } from "react-native";

interface BadgeProps {
  count?: number | string;
  size?: number;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ count, size = 20, className = "" }) => {
  if (!count) return null;

  return (
    <View
      className={`absolute -top-2 -right-2 bg-red-500 rounded-full items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <Text className="text-white text-xs font-bold">{String(count)}</Text>
    </View>
  );
};

export default Badge;
