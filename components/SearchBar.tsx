import React from "react";
import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText }) => {
  return (
    <View className="mx-4 my-3">
      <View className="flex-row items-center bg-white rounded-lg px-4 py-2 shadow-sm">
        <Ionicons name="search" size={20} color="#4b5563" />
        <TextInput
          className="flex-1 mr-2 text-right text-gray-800"
          placeholder="ابحث عن منتج أو خدمة..."
          placeholderTextColor="#9ca3af"
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
};

export default SearchBar;
