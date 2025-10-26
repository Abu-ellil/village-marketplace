import React from "react";
import { View, Text } from "react-native";
import ServerStatusIndicator from "./ServerStatusIndicator";

const Header = ({ cartItemsCount }: { cartItemsCount?: number }) => {
  return (
    <View className="bg-white border-b border-neutral-200 px-4 py-3 shadow-sm">
      <View className="flex-row justify-between items-center">
        <View className="items-center flex-1">
          <Text className="text-xl font-bold text-primary-dark">سوق القرية</Text>
          <Text className="text-sm text-neutral-500">بيع وشراء وخدمات محلية</Text>
        </View>
        <View className="ml-2">
          <ServerStatusIndicator size="small" />
        </View>
      </View>
    </View>
  );
};

export default Header;
