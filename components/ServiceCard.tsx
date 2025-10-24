import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Service } from "../types/Service";
import Button from "./ui/Button";
import Card from "./ui/Card";
import { colors } from "../theme/colors";
import { useRouter } from "expo-router";

interface ServiceCardProps {
  service: Service;
  onContact?: (phone?: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onContact }) => {
  const { router } = useRouter();
  const makeCall = (phoneNumber?: string) => {
    if (!phoneNumber) return;
    Linking.openURL(`tel:${phoneNumber}`);
    onContact && onContact(phoneNumber);
  };

  const averageRating = service.reviews && service.reviews.length > 0
    ? (service.reviews.reduce((sum, review) => sum + review.rating, 0) / service.reviews.length).toFixed(1)
    : service.rating?.toFixed(1) || '0.0';
  const numberOfReviews = service.reviews ? service.reviews.length : 0;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/service/${service.id}`)}
      activeOpacity={0.8}
    >
      <Card>
        <View className="p-4">
          {/* Service Icon/Category */}
          <View className="mb-3 flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
              <Text className="text-xl">{service.icon || "🛠"}</Text>
            </View>
            <View className="flex-1">
              <Text
                className="text-lg font-bold text-neutral-900"
                numberOfLines={1}
              >
                {service.name}
              </Text>
              <View className="flex-row items-center">
                <Text className="text-sm text-neutral-500" numberOfLines={1}>
                  {service.provider}
                </Text>
                {averageRating !== '0.0' && (
                  <View className="flex-row items-center mr-2">
                    <Ionicons name="star" size={12} color={colors.warning} />
                    <Text className="text-xs text-warning font-medium mr-0.5">
                      {averageRating}
                    </Text>
                    {numberOfReviews > 0 && (
                      <Text className="text-xs text-neutral-500">({numberOfReviews})</Text>
                    )}
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Description */}
          {service.description ? (
            <Text className="text-neutral-600 text-sm mb-3" numberOfLines={2}>
              {service.description}
            </Text>
          ) : null}

          {/* Price and Call Action */}
          <View className="flex-row items-center justify-between">
            {service.price !== undefined ? (
              <View>
                <Text className="text-base font-bold text-primary">
                  {service.price}
                  {service.unit && (
                    <Text className="text-sm font-normal text-neutral-500">
                      /{service.unit}
                    </Text>
                  )}
                </Text>
              </View>
            ) : (
              <View />
            )}

            <Button
              accessibilityLabel={`Call ${service.provider}`}
              onPress={(e) => { e.stopPropagation(); makeCall(service.phone); }}
              variant="secondary"
              className="px-4 py-2"
            >
              <View className="flex-row items-center">
                <Ionicons name="call" size={18} color="white" />
                <Text className="text-white font-bold mr-2">اتصال</Text>
              </View>
            </Button>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default ServiceCard;
