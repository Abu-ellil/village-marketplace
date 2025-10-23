import React from "react";
import { View, ScrollView, Text } from "react-native";
import Header from "../components/Header";

export default function Orders() {
  return (
    <View className="flex-1 bg-gray-100">
      <Header />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-xl font-bold mb-4">الطلبات</Text>
        <Text>لا توجد طلبات حالياً.</Text>
      </ScrollView>
    </View>
  );
}
