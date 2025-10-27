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
      }}
    >
      {categories && Array.isArray(categories) ? categories.map((category) => {
        const isSelected = (selectedCategory === category.id) || (category.id === 'all' && (!selectedCategory || selectedCategory === 'all'));

        return (
          <TouchableOpacity
            key={category.id}
            onPress={() => onSelectCategory(category.id)}
            className={`px-4 rounded-full flex-row items-center ${
              isSelected ? "bg-green-400" : "bg-white border border-neutral-200"
            }`}
            style={{
              height: 44,
              minWidth: 80,
              paddingHorizontal: 14,
              justifyContent: "center",
              marginRight: 8,
              shadowColor: colors.primary.DEFAULT,
              shadowOpacity: isSelected ? 0.18 : 0,
              shadowRadius: isSelected ? 6 : 0,
              shadowOffset: { width: 0, height: 2 },
              elevation: isSelected ? 3 : 0,
            }}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
          >


            <Text
              className={`${
                isSelected ? "text-white" : "text-neutral-600"
              } font-medium`}
              numberOfLines={1}
              style={{ maxWidth: 120, textAlign: "right" }}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        );
      }) : null}
    </ScrollView>
  );
};

export default CategoryFilter;
