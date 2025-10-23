import React from "react";
import { ScrollView, TouchableOpacity, Text } from "react-native";
import { Category } from "../types/Category";
import { colors } from "../theme/colors";

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
      className="mb-2"
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 8,
        height:56,
      }}
    >
      {categories.map((category) => {
        const isSelected = selectedCategory === category.id;
        return (
          <TouchableOpacity
            key={category.id}
            onPress={() => onSelectCategory(category.id)}
            className={`
              px-4 py-2.5 rounded-full flex-row items-center
              ${
                isSelected
                  ? "bg-green-400 shadow-sm "
                  : "bg-white rounded-full border border-neutral-200"
              }
            `}
            style={{
              shadowColor: colors.primary.DEFAULT,
              shadowOpacity: isSelected ? 0.2 : 0,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
              elevation: isSelected ? 3 : 0,
            }}
          >
            <Text className="mr-2 text-lg">{category.icon}</Text>
            <Text
              className={`${
                isSelected ? "text-white" : "text-neutral-600"
              } font-medium`}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default CategoryFilter;
