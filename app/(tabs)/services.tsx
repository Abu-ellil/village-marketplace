import React from "react";
import { View, ScrollView, Text } from "react-native";
import Header from "../../components/Header";
import ServiceCard from "../../components/ServiceCard";
import { useServices } from "../../app/lib/api";
import { ActivityIndicator } from "react-native";
import { colors } from "../../theme/colors";

export default function Services() {
  const { data: services, isLoading, isError } = useServices();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      </View>
    );
  }

  if (isError || !services) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text>حدث خطأ أثناء تحميل الخدمات</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <Header />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-xl font-bold mb-4 px-1">الخدمات</Text>
        {services.map((s) => (
          <ServiceCard key={s.id} service={s} />
        ))}
      </ScrollView>
    </View>
  );
}
