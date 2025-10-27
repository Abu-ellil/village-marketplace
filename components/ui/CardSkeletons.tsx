import React from "react";
import { View } from "react-native";
import Card from "./Card";
import Shimmer from "./Shimmer";

export function ProductCardSkeleton() {
  return (
    <Card noPadding>
      <Shimmer height={160} borderRadius={0} />
      <View className="p-3">
        <Shimmer width="80%" height={20} className="mb-2" />
        <Shimmer width="50%" height={16} className="mb-3" />
        <View className="flex-row justify-between mb-3">
          <Shimmer width={60} height={14} />
          <Shimmer width={80} height={14} />
        </View>
        <View className="flex-row gap-2">
          <Shimmer width="70%" height={36} className="rounded-lg" />
          <Shimmer width="25%" height={36} className="rounded-lg" />
        </View>
      </View>
    </Card>
  );
}

export function ServiceCardSkeleton() {
  return (
    <Card>
      <View className="flex-row mb-3">
        <Shimmer width={40} height={40} borderRadius={20} className="mr-3" />
        <View className="flex-1">
          <Shimmer width="70%" height={20} className="mb-1" />
          <Shimmer width="40%" height={16} />
        </View>
      </View>
      <Shimmer width="90%" height={32} className="mb-3" />
      <View className="flex-row justify-between items-center">
        <Shimmer width="30%" height={24} />
        <Shimmer width="30%" height={36} className="rounded-lg" />
      </View>
    </Card>
  );
}

export function CardSkeleton() {
  return (
    <View className="bg-white rounded-xl p-4 m-2 flex-1 items-center justify-center shadow-sm"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        minWidth: 100,
        minHeight: 120
      }}
    >
      <Shimmer width={48} height={48} borderRadius={24} className="mb-2" />
      <Shimmer width="80%" height={16} />
    </View>
  );
}
