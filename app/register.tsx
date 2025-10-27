import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router';
import * as Location from 'expo-location';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Button from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { API_BASE_URL } from '../utils/config';

export default function Register() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    console.log('Location state changed:', location);
  }, [location]);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const { register, isLoading } = useAuth();
  const { show } = useToast();
  const router = useRouter();

  const requestLocationPermission = async () => {
    setIsLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('إذن الموقع مطلوب', 'يرجى السماح بالوصول إلى الموقع لتحديد موقعك الحالي');
        setIsLocationLoading(false);
        return;
      }

      const locationData = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = locationData.coords;
      setLocation({ latitude, longitude });

      // Reverse geocode to find address
      const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (addresses.length > 0) {
        const addr = addresses[0];
        const formattedAddress = [addr.street, addr.city, addr.region, addr.postalCode, addr.country].filter(Boolean).join(', ');
        setAddress(formattedAddress);
      }

      show('تم تحديد الموقع والعنوان بنجاح');
    } catch (error) {
      console.error('Error getting location or address:', error);
      show('فشل في تحديد الموقع أو العنوان');
    } finally {
      setIsLocationLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !phone || !email) {
      show('الرجاء إدخال الاسم ورقم الهاتف والبريد الإلكتروني');
      return;
    }

    if (!location) {
      show('يرجى تحديد موقعك');
      return;
    }

    show('جاري معالجة طلب التسجيل...');
    
    const success = await register({
      name,
      phone,
      email,
      address,
      bio: bio || undefined,
      coordinates: [location.longitude, location.latitude],
    });

    if (success) {
      show('تم التسجيل بنجاح');
      router.replace('/');
    } else {
      show('فشل التسجيل. حاول مرة أخرى.');
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <Header />
      <ScrollView className="flex-1 p-4">
        <Text className="text-3xl font-bold mb-6">إنشاء حساب جديد</Text>

        <TextInput
          className="w-full p-3 bg-white rounded-lg mb-4 border border-gray-300"
          placeholder="الاسم الكامل *"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <TextInput
          className="w-full p-3 bg-white rounded-lg mb-4 border border-gray-300"
          placeholder="رقم الهاتف * (مثال: 01234567890)"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          autoCapitalize="none"
        />

        <TextInput
          className="w-full p-3 bg-white rounded-lg mb-4 border border-gray-300"
          placeholder="البريد الإلكتروني *"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          className="w-full p-3 bg-white rounded-lg mb-4 border border-gray-300"
          placeholder="العنوان التفصيلي"
          value={address}
          onChangeText={setAddress}
          multiline
        />

        <TextInput
          className="w-full p-3 bg-white rounded-lg mb-4 border border-gray-300"
          placeholder="نبذة عنك (اختياري)"
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity
          className="w-full p-3 bg-blue-500 rounded-lg mb-4 flex-row items-center justify-center"
          onPress={requestLocationPermission}
          disabled={isLocationLoading}
        >
          {isLocationLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">
              {location ? 'تم تحديد الموقع ✓' : 'تحديد الموقع الحالي *'}
            </Text>
          )}
        </TouchableOpacity>

        <Button onPress={handleRegister} variant="primary" className="w-full mb-4">
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">تسجيل</Text>
          )}
        </Button>

        <Link href="/login" asChild>
          <TouchableOpacity>
            <Text className="text-blue-600 text-base text-center">لديك حساب بالفعل؟ تسجيل الدخول</Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </View>
  );
}