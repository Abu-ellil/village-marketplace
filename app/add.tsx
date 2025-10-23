import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Header from "../components/Header";

export default function AddItem() {
  const [title, setTitle] = React.useState("");
  const [price, setPrice] = React.useState("");

  return (
    <View className="flex-1 bg-gray-100">
      <Header />
      <View className="p-4">
        <Text className="text-lg font-bold mb-2">أضف منتج أو خدمة</Text>
        <TextInput
          className="bg-white p-3 rounded mb-3"
          placeholder="عنوان المنتج / الخدمة"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          className="bg-white p-3 rounded mb-3"
          placeholder="السعر"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <TouchableOpacity className="bg-green-600 px-4 py-3 rounded">
          <Text className="text-white text-center font-bold">نشر</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
