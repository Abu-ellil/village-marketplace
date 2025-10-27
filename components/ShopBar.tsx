import React from "react";
import { ScrollView, TouchableOpacity, Text, View } from "react-native";
import ImageWithPlaceholder from "./ui/ImageWithPlaceholder";

type SellerItem = { name: string; image?: string | null; id?: string };

interface ShopBarProps {
  sellers: SellerItem[];
  selectedSeller: string | null;
  onSelectSeller: (name: string | null) => void;
}

export default function ShopBar({
  sellers,
  selectedSeller,
  onSelectSeller,
}: ShopBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-2"
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 6 }}
    >
      <TouchableOpacity
        onPress={() => onSelectSeller(null)}
        className={`px-4 rounded-full flex-row items-center ${
          selectedSeller == null
            ? "bg-green-400"
            : "bg-white border border-neutral-200"
        }`}
        style={{
          height: 40,
          paddingHorizontal: 12,
          justifyContent: "center",
          marginRight: 8,
        }}
      >
        <Text
          className={`${
            selectedSeller == null ? "text-white" : "text-neutral-600"
          } font-medium`}
        >
          الكل
        </Text>
      </TouchableOpacity>

      {sellers.map((s) => {
        const isSelected = selectedSeller === s.name;
        return (
          <TouchableOpacity
            key={s.id || `seller-${s.name}`}
            onPress={() => onSelectSeller(isSelected ? null : s.name)}
            className={`px-3 rounded-full flex-row items-center ${
              isSelected ? "bg-green-400" : "bg-white border border-neutral-200"
            }`}
            style={{
              height: 40,
              paddingHorizontal: 10,
              justifyContent: "center",
              marginRight: 8,
            }}
          >
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                overflow: "hidden",
                marginLeft: 8,
              }}
            >
              <ImageWithPlaceholder uri={s.image} width={28} height={28} />
            </View>
            <Text
              className={`${
                isSelected ? "text-white" : "text-neutral-600"
              } font-medium`}
              numberOfLines={1}
              style={{ maxWidth: 140, textAlign: "right" }}
            >
              {s.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
