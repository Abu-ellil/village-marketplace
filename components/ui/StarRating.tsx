import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

interface StarRatingProps {
  rating: number;
  size?: number;
  showNumber?: boolean;
  totalReviews?: number;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = 16,
  showNumber = false,
  totalReviews,
}) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <View className="flex-row items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Ionicons key={`full-${i}`} name="star" size={size} color={colors.warning} />
      ))}
      {halfStar && (
        <Ionicons name="star-half" size={size} color={colors.warning} />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Ionicons key={`empty-${i}`} name="star-outline" size={size} color={colors.warning} />
      ))}
      {showNumber && (
        <Text className="mr-1 text-sm text-warning font-medium">
          {rating.toFixed(1)}
        </Text>
      )}
      {totalReviews !== undefined && totalReviews > 0 && (
        <Text className="text-sm text-neutral-500">({totalReviews})</Text>
      )}
    </View>
  );
};

export default StarRating;
