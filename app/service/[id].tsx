import React from "react";
import { View, Text, ScrollView, Linking } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SERVICES as services } from "../../data/mockData";
import Header from "../../components/Header";
import Button from "../../components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import StarRating from "../../components/ui/StarRating";

export default function ServiceDetail() {
  const { id } = useLocalSearchParams();
  const service = services.find((s) => String(s.id) === id);

  if (!service) {
    return (
      <View>
        <Header />
        <Text className="p-4 text-center">الخدمة غير موجودة</Text>
      </View>
    );
  };

  const makeCall = (phoneNumber?: string) => {
    if (!phoneNumber) return;
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const averageRating = service.reviews && service.reviews.length > 0
    ? (service.reviews.reduce((sum, review) => sum + review.rating, 0) / service.reviews.length)
    : service.rating || 0;
  const numberOfReviews = service.reviews ? service.reviews.length : 0;

  return (
    <View className="flex-1 bg-white">
      <Header />
      <ScrollView>
        <View className="p-4">
          <Text className="text-2xl font-bold mb-2">{service.name}</Text>

          <View className="flex-row items-center mb-2">
            <StarRating
              rating={averageRating}
              size={18}
              showNumber={true}
              totalReviews={numberOfReviews}
            />
          </View>

          <Text className="text-base text-gray-700 mb-4">
            {service.description}
          </Text>

          {/* Provider Info */}
          <View className="border-t border-gray-200 pt-4">
            <Text className="text-lg font-semibold mb-2">معلومات مقدم الخدمة</Text>
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-4">
                <Text className="text-xl">{service.icon || "🛠"}</Text>
              </View>
              <View>
                <Text className="text-base font-semibold">{service.provider}</Text>
                <Text className="text-sm text-gray-500">{service.village}</Text>
              </View>
            </View>
            <Button
              accessibilityLabel={`Call ${service.provider}`}
              onPress={() => makeCall(service.phone)}
              variant="secondary"
              className="mt-4 w-full"
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="call" size={18} color="white" />
                <Text className="text-white font-bold mr-2">اتصال بمقدم الخدمة</Text>
              </View>
            </Button>
          </View>

          {/* Reviews Section */}
          {numberOfReviews > 0 && (
            <View className="border-t border-gray-200 pt-4 mt-4">
              <Text className="text-lg font-semibold mb-3">التقييمات ({numberOfReviews})</Text>
              {service.reviews?.map((review) => (
                <View key={review.id} className="bg-gray-50 p-3 rounded-lg mb-3">
                  <View className="flex-row items-center mb-1">
                    <StarRating rating={review.rating} size={14} showNumber={true} />
                    <Text className="text-sm text-neutral-500">بواسطة {review.reviewerName}</Text>
                  </View>
                  <Text className="text-gray-700 mb-1">{review.comment}</Text>
                  <Text className="text-xs text-neutral-400">
                    {new Date(review.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
