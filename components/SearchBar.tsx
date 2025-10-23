import React from "react";
import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText }) => {
  return (
    <View className="px-4 py-2">
      <View className="flex-row items-center bg-white rounded-full px-4 py-3 shadow-md border border-neutral-100">
        <Ionicons
          name={value ? "close-circle" : "search"}
          size={20}
          color={value ? colors.primary.DEFAULT : colors.neutral[400]}
          onPress={() => value && onChangeText("")}
        />
        <TextInput
          className="flex-1 mr-3 text-right text-base text-neutral-800"
          placeholder="ابحث عن منتج أو بائع..."
          placeholderTextColor={colors.neutral[400]}
          value={value}
          onChangeText={onChangeText}
          clearButtonMode="never"
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>
    </View>
  );
};

export default SearchBar;
