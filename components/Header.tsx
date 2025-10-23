import React from "react";
import { View, Text } from "react-native";

const Header = ({ cartItemsCount }: { cartItemsCount?: number }) => {
  return (
    <View className="bg-white border-b border-neutral-200 px-4 py-3 shadow-sm">
      <View className="items-center">
        <Text className="text-xl font-bold text-primary-dark">سوق القرية</Text>
        <Text className="text-sm text-neutral-500">بيع وشراء وخدمات محلية</Text>
      </View>
    </View>
  );
};

export default Header;
