import React from "react";
import { View, ScrollView, Text } from "react-native";
import Header from "../components/Header";
import ServiceCard from "../components/ServiceCard";
import { SERVICES } from "../data/mockData";

export default function Services() {
  return (
    <View className="flex-1 bg-gray-100">
      <Header />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-xl font-bold mb-4 px-1">الخدمات</Text>
        {SERVICES.map((s) => (
          <ServiceCard key={s.id} service={s} />
        ))}
      </ScrollView>
    </View>
  );
}
