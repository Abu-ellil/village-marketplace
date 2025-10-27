import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Category } from '../types/Category';

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="bg-white rounded-xl p-4 m-2 flex-1 items-center justify-center shadow-sm"
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
      <View className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
        <Text className="text-2xl">
          {category.icon && typeof category.icon === 'string' ? category.icon : '📦'}
        </Text>
      </View>
      <Text className="text-center text-neutral-800 font-medium" numberOfLines={2}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryCard;