import React from "react";
import { ScrollView, TouchableOpacity, Text } from "react-native";
import { Category } from "../types/Category";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: string | null;
  onSelectCategory: (id: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="px-4"
      contentContainerStyle={{ paddingVertical: 12 }}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          onPress={() => onSelectCategory(category.id)}
          className={`mr-3 px-4 py-2 rounded-full flex-row items-center ${
            selectedCategory === category.id
              ? "bg-green-600"
              : "bg-white border border-gray-200"
          }`}
        >
          <Text className="mr-2 text-lg">{category.icon}</Text>
          <Text
            className={`${
              selectedCategory === category.id ? "text-white" : "text-gray-700"
            } font-medium`}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default CategoryFilter;
