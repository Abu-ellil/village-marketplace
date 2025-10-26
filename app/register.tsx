import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router';
import * as Location from 'expo-location';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Button from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { API_BASE_URL } from '../utils/config';

interface Village {
  _id: string;
  name: string;
  governorate: string;
  center: string;
}

export default function Register() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [village, setVillage] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [villages, setVillages] = useState<Village[]>([]);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const { register, isLoading } = useAuth();
  const { show } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchVillages();
  }, []);

  const fetchVillages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/villages`);
      const data = await response.json();
      if (data.success) {
        setVillages(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch villages:', error);
    }
  };

  const requestLocationPermission = async () => {
    setIsLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('إذن الموقع مطلوب', 'يرجى السماح بالوصول إلى الموقع لتحديد موقعك الحالي');
        return;
      }

      const locationData = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
      });
      show('تم تحديد الموقع بنجاح');
    } catch (error) {
      console.error('Error getting location:', error);
      show('فشل في تحديد الموقع');
    } finally {
      setIsLocationLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !phone || !village) {
      show('الرجاء إدخال الاسم ورقم الهاتف والقرية');
      return;
    }

    if (!location) {
      show('يرجى تحديد موقعك');
      return;
    }

    const success = await register({
      name,
      phone,
      email: email || undefined,
      villageId: village,
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
          placeholder="البريد الإلكتروني (اختياري)"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          className="w-full p-3 bg-white rounded-lg mb-4 border border-gray-300"
          onPress={() => {
            // Simple village picker - in real app, use a proper picker
            Alert.alert('اختيار القرية', 'يرجى اختيار قريتك من القائمة', [
              { text: 'إلغاء', style: 'cancel' },
              ...villages.slice(0, 5).map(v => ({
                text: `${v.name} - ${v.governorate}`,
                onPress: () => setVillage(v._id)
              }))
            ]);
          }}
        >
          <Text className={village ? "text-black" : "text-gray-500"}>
            {village ? villages.find(v => v._id === village)?.name || 'قرية محددة' : 'اختر القرية *'}
          </Text>
        </TouchableOpacity>

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
