import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Service } from "../types/Service";

interface ServiceCardProps {
  service: Service;
  onContact?: (phone?: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onContact }) => {
  const makeCall = (phoneNumber?: string) => {
    if (!phoneNumber) return;
    Linking.openURL(`tel:${phoneNumber}`);
    onContact && onContact(phoneNumber);
  };

  return (
    <View className="bg-white rounded-xl shadow-md p-4 m-2">
      <Text className="text-xl font-bold mb-1">{service.name}</Text>
      {service.description ? (
        <Text className="text-gray-700 mb-2">{service.description}</Text>
      ) : null}

      {service.price !== undefined && (
        <Text className="text-green-600 font-bold mb-2">
          {service.price} {service.unit ? ` / ${service.unit}` : ""}
        </Text>
      )}

      <View className="flex-row items-center justify-between">
        <Text className="text-gray-600">{service.provider}</Text>
        <TouchableOpacity
          onPress={() => makeCall(service.phone)}
          className="bg-blue-600 px-3 py-2 rounded-lg flex-row items-center"
        >
          <Ionicons name="call" size={18} color="white" />
          <Text className="text-white mr-2">اتصال</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ServiceCard;
