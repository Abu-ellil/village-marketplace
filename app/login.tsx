import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Button from '../components/ui/Button';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const { show } = useToast();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      show('الرجاء إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }
    const success = await login(email, password);
    if (success) {
      show('تم تسجيل الدخول بنجاح');
      router.replace('/'); // Redirect to home or previous screen
    } else {
      show('فشل تسجيل الدخول. تحقق من بيانات الاعتماد.');
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <Header />
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-3xl font-bold mb-6">تسجيل الدخول</Text>

        <TextInput
          className="w-full p-3 bg-white rounded-lg mb-4 border border-gray-300"
          placeholder="البريد الإلكتروني"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          className="w-full p-3 bg-white rounded-lg mb-6 border border-gray-300"
          placeholder="كلمة المرور"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button onPress={handleLogin} variant="primary" className="w-full mb-4">
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">تسجيل الدخول</Text>
          )}
        </Button>

        <Link href="/register" asChild>
          <TouchableOpacity>
            <Text className="text-blue-600 text-base">ليس لديك حساب؟ سجل الآن</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
