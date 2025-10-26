import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { useRouter } from 'expo-router';

export default function Profile() {
  const { user, logout } = useAuth();
  const { show } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    show('تم تسجيل الخروج بنجاح');
    router.replace('/login');
  };

  if (!user) {
    return (
      <View className="flex-1 bg-gray-100">
        <Header />
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-xl">الرجاء تسجيل الدخول لعرض ملفك الشخصي</Text>
          <Button onPress={() => router.push('/login')} variant="primary" className="mt-4">
            تسجيل الدخول
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <Header />
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-4">ملفي الشخصي</Text>

        <View className="bg-white rounded-lg p-4 mb-4 shadow">
          <Text className="text-lg font-semibold mb-2">الاسم:</Text>
          <Text className="text-base text-gray-700">{user.name}</Text>
        </View>

        <View className="bg-white rounded-lg p-4 mb-4 shadow">
          <Text className="text-lg font-semibold mb-2">البريد الإلكتروني:</Text>
          <Text className="text-base text-gray-700">{user.email}</Text>
        </View>

        <Button onPress={handleLogout} variant="secondary" className="w-full mt-4">
          تسجيل الخروج
        </Button>
      </View>
    </View>
  );
}