import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types/Product';

const { width } = Dimensions.get('window');

// Product Card Component for Grid View (2 columns)
const ProductCardGrid = ({ product, onAddToCart }) => {
  const imageUrl = product.image || product.mainImage?.url || product.images?.[0]?.url;
  const isValidUrl = typeof imageUrl === 'string' &&
    (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) &&
    imageUrl.length > 10 && // Ensure it's not just an emoji or short string
    (imageUrl.includes('.') && (imageUrl.includes('/') || imageUrl.includes('picsum')));
  return (
    <TouchableOpacity 
      className="bg-white rounded-2xl m-2 shadow-sm overflow-hidden"
      style={{ width: (width - 48) / 2 }}
      activeOpacity={0.9}
    >
      {/* Product Image */}
      <View className="relative w-full h-40 bg-gray-100">
        <Image
          source={{ uri: isValidUrl ? imageUrl : 'https://bit.ly/3JtI1lc' }}
          style={{ width: '100%', height: 160, backgroundColor: 'transparent' }}
          resizeMode="cover"
        />
        
        {/* Discount Badge */}
        {product.discount && (
          <View className="absolute top-2 left-2 bg-red-500 rounded-full px-2 py-1">
            <Text className="text-white text-xs font-bold">-{product.discount}%</Text>
          </View>
        )}
        
        {/* Favorite Button */}
        <TouchableOpacity className="absolute top-2 right-2 bg-white rounded-full p-1.5">
          <Ionicons name="heart-outline" size={18} color="#EF4444" />
        </TouchableOpacity>
        
        {/* New Badge */}
        {product.isNew && (
          <View className="absolute bottom-2 left-2 bg-emerald-500 rounded-full px-2 py-1">
            <Text className="text-white text-xs font-bold">جديد</Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View className="p-3">
        {/* Category */}
        <Text className="text-gray-500 text-xs mb-1" numberOfLines={1}>
          {typeof product.category === 'object' ? product.category.name || product.category.title : product.category}
        </Text>
        
        {/* Product Name */}
        <Text className="text-gray-800 font-bold text-sm mb-2" numberOfLines={2}>
          {product.name}
        </Text>
        
        {/* Rating */}
        <View className="flex-row items-center mb-2">
          <Ionicons name="star" size={14} color="#FCD34D" />
          <Text className="text-gray-600 text-xs mr-1">
            {product.rating || 4.5} ({product.reviewsCount || 0})
          </Text>
        </View>
        
        {/* Price Section */}
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-emerald-600 font-bold text-lg">
              {product.price} ج.م
            </Text>
            {product.oldPrice && (
              <Text className="text-gray-400 text-xs line-through">
                {product.oldPrice} ج.م
              </Text>
            )}
          </View>
          
          {/* Add to Cart Button */}
          <TouchableOpacity
            onPress={() => onAddToCart(product)}
            className="bg-emerald-500 rounded-full p-2"
            activeOpacity={0.8}
          >
            <Ionicons name="cart-outline" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Product Card Component for List View (1 column)
const ProductCardList = ({ product, onAddToCart }) => {
  const imageUrl = product.image || product.mainImage?.url || product.images?.[0]?.url;
  const isValidUrl = typeof imageUrl === 'string' &&
    (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) &&
    imageUrl.length > 10 && // Ensure it's not just an emoji or short string
    (imageUrl.includes('.') && (imageUrl.includes('/') || imageUrl.includes('picsum')));
  return (
    <TouchableOpacity
      className="bg-white rounded-2xl mx-4 mb-3 shadow-sm overflow-hidden flex-row"
      style={{ height: 120 }}
      activeOpacity={0.9}
    >
      {/* Product Image */}
      <View className="relative w-28 h-full bg-gray-100">
        <Image
          source={{ uri: isValidUrl ? imageUrl : 'https://bit.ly/3JtI1lc' }}
          style={{ width: 112, height: 120, backgroundColor: 'transparent' }}
          resizeMode="cover"
        />
        
        {/* Discount Badge */}
        {product.discount && (
          <View className="absolute top-2 left-2 bg-red-500 rounded-full px-2 py-1">
            <Text className="text-white text-xs font-bold">-{product.discount}%</Text>
          </View>
        )}
        
        {/* New Badge */}
        {product.isNew && (
          <View className="absolute bottom-2 left-2 bg-emerald-500 rounded-full px-2 py-1">
            <Text className="text-white text-xs font-bold">جديد</Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View className="flex-1 p-3 justify-between">
        <View>
          {/* Category */}
          <Text className="text-gray-500 text-xs mb-1" numberOfLines={1}>
            {typeof product.category === 'object' ? product.category.name || product.category.title : product.category}
          </Text>
          
          {/* Product Name */}
          <Text className="text-gray-800 font-bold text-base mb-2" numberOfLines={2}>
            {product.name}
          </Text>
          
          {/* Rating */}
          <View className="flex-row items-center mb-2">
            <Ionicons name="star" size={14} color="#FCD34D" />
            <Text className="text-gray-600 text-xs mr-1">
              {product.rating || 4.5} ({product.reviewsCount || 0})
            </Text>
            {product.stock && (
              <Text className="text-gray-500 text-xs mr-2">
                • متوفر {product.stock}
              </Text>
            )}
          </View>
        </View>
        
        {/* Price Section */}
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-emerald-600 font-bold text-xl">
              {product.price} ج.م
            </Text>
            {product.oldPrice && (
              <Text className="text-gray-400 text-sm line-through">
                {product.oldPrice} ج.م
              </Text>
            )}
          </View>
          
          {/* Action Buttons */}
          <View className="flex-row space-x-2">
            <TouchableOpacity
              className="bg-gray-100 rounded-full p-2"
              activeOpacity={0.8}
            >
              <Ionicons name="heart-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => onAddToCart(product)}
              className="bg-emerald-500 rounded-full p-2"
              activeOpacity={0.8}
            >
              <Ionicons name="cart-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Main Product List Component
const FancyProductList = ({ productsToDisplay, addToCart }: { productsToDisplay?: Product[]; addToCart: (product: Product) => void }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // 'grid' or 'list'

  return (
    <View className="mt-4 flex-1">
      {/* Header with Toggle */}
      <View className="flex-row items-center justify-between px-4 mb-3">
        <View>
          <Text className="text-2xl font-bold text-gray-800">
            المنتجات
          </Text>
          <Text className="text-gray-500 text-sm">
            {productsToDisplay?.length || 0} منتج متاح
          </Text>
        </View>
        
        {/* View Mode Toggle */}
        <View className="flex-row bg-gray-100 rounded-full p-1">
          <TouchableOpacity
            onPress={() => setViewMode('grid')}
            className={`rounded-full px-3 py-2 ${
              viewMode === 'grid' ? 'bg-white shadow-sm' : ''
            }`}
            activeOpacity={0.8}
          >
            <Ionicons
              name="grid-outline"
              size={20}
              color={viewMode === 'grid' ? '#10B981' : '#9CA3AF'}
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setViewMode('list')}
            className={`rounded-full px-3 py-2 ${
              viewMode === 'list' ? 'bg-white shadow-sm' : ''
            }`}
            activeOpacity={0.8}
          >
            <Ionicons
              name="list-outline"
              size={20}
              color={viewMode === 'list' ? '#10B981' : '#9CA3AF'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Products List */}
      {productsToDisplay && productsToDisplay.length > 0 ? (
        <FlashList
          data={productsToDisplay}
          renderItem={({ item }) =>
            viewMode === 'grid' ? (
              <ProductCardGrid product={item} onAddToCart={addToCart} />
            ) : (
              <ProductCardList product={item} onAddToCart={addToCart} />
            )
          }
          keyExtractor={(item) => item.id.toString()}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode} // Important: Force re-render when changing columns
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        // Empty State
        <View className="flex-1 items-center justify-center py-20">
          <View className="bg-gray-100 rounded-full p-8 mb-4">
            <Ionicons name="cart-outline" size={64} color="#9CA3AF" />
          </View>
          <Text className="text-gray-600 text-xl font-bold mb-2">
            لا توجد منتجات
          </Text>
          <Text className="text-gray-500 text-center px-8">
            لم يتم العثور على أي منتجات في الوقت الحالي
          </Text>
        </View>
      )}
    </View>
  );
};

export default FancyProductList;

// Usage Example:
/*
<FancyProductList 
  productsToDisplay={products} 
  addToCart={handleAddToCart}
/>

// Expected product structure:
{
  id: 1,
  name: 'Product Name',
  image: 'https://...',
  category: 'Electronics',
  price: 299,
  oldPrice: 399,
  discount: 25,
  rating: 4.5,
  reviewsCount: 120,
  stock: 15,
  isNew: true
}
*/