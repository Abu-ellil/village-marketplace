import React from "react";
import { View, Text } from "react-native";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "لا توجد نتائج",
  subtitle,
}) => {
  return (
    <View className="items-center justify-center p-8">
      <Text className="text-3xl mb-2">🛒</Text>
      <Text className="text-lg font-semibold">{title}</Text>
      {subtitle ? <Text className="text-gray-600 mt-1">{subtitle}</Text> : null}
    </View>
  );
};

export default EmptyState;
