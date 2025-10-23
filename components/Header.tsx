import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

const Header = ({ cartItemsCount = 0 }) => {
  const navigation: any = useNavigation();

  return (
    <View className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-3">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.navigate("index")}>
          <Ionicons name="home" size={24} color="white" />
        </TouchableOpacity>

        <View className="items-center flex-1 mx-4">
          <Text className="text-white text-xl font-bold">سوق القرية</Text>
          <Text className="text-white text-sm">بيع وشراء وخدمات محلية</Text>
        </View>

        <View className="flex-row items-center">
          <TouchableOpacity
            className="bg-white px-3 py-1 rounded-full mr-3"
            onPress={() => navigation.navigate("add")}
          >
            <Text className="text-green-600 font-medium">أضف منتج/خدمة</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="relative"
            onPress={() => navigation.navigate("cart")}
          >
            <Ionicons name="cart" size={24} color="white" />
            {cartItemsCount > 0 && (
              <View className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-white text-xs font-bold">
                  {cartItemsCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Header;
