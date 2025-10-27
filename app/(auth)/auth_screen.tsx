import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../../utils/config';
import { useAuth } from '../../context/AuthContext';
import { useLocalSearchParams, useRouter, useSegments } from 'expo-router';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { reverseGeocodeAsync } from 'expo-location';

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  coordinates: number[] | null;
  address: string | null;
}

const AuthScreen = ({ initialIsLogin = true }) => {
  const router = useRouter();
  const auth = useAuth();
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    coordinates: null,
    address: null,
  });

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Get current location using GPS
  const getCurrentLocation = async () => {
    try {
      // Request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('خطأ', 'صلاحيات الموقع مطلوبة لتحديد موقعك');
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Reverse geocode to get address
      const addresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      const address = addresses[0] ?
        `${addresses[0].name || addresses[0].street || ''}, ${addresses[0].district || addresses[0].subregion || ''}, ${addresses[0].city || addresses[0].region || ''}`.replace(/^, |, $/g, '')
        : 'لم يتمكن من تحديد العنوان';

      // Update form data with coordinates [longitude, latitude] and address
      setFormData(prev => ({
        ...prev,
        coordinates: [location.coords.longitude, location.coords.latitude],
        address: address
      }));

      Toast.show({
        type: 'success',
        text1: 'نجح',
        text2: 'تم جلب الموقع الجغرافي بنجاح',
        position: 'top',
        visibilityTime: 2000,
      });
    } catch (error) {
      console.error('Error getting location:', error);
      Toast.show({
        type: 'error',
        text1: 'خطأ',
        text2: 'فشل في جلب الموقع الجغرافي',
        position: 'top',
        visibilityTime: 3000,
      });
    }
  };

  // Validate Egyptian phone number
  const validatePhone = (phone) => {
    const regex = /^(\+20|0)?1[0-9]{9}$/;
    return regex.test(phone);
  };

  // Validate email
  const validateEmail = (email) => {
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  };

  // Handle Login
  const handleLogin = async () => {
    // Validation
    if (!formData.phone) {
      Toast.show({
        type: 'error',
        text1: 'خطأ',
        text2: 'رقم الهاتف مطلوب',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (!validatePhone(formData.phone)) {
      Toast.show({
        type: 'error',
        text1: 'خطأ',
        text2: 'رقم الهاتف غير صحيح',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (!formData.password) {
      Toast.show({
        type: 'error',
        text1: 'خطأ',
        text2: 'كلمة المرور مطلوبة',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    setLoading(true);

    // Use the auth store to handle login
    const loginSuccess = await auth.loginWithPhone(formData.phone, formData.password);
    
    if (loginSuccess) {
      Toast.show({
        type: 'success',
        text1: 'نجح',
        text2: 'تم تسجيل الدخول بنجاح',
        position: 'top',
        visibilityTime: 2000,
      });
      // Navigate to home screen after successful login
      setTimeout(() => {
        router.replace('/(tabs)/index');
      }, 100);
    } else {
      // The auth store will show a specific error toast
      // but we can show a generic one here if needed, or just rely on the store's toast.
      // For example:
      Toast.show({
        type: 'error',
        text1: 'فشل تسجيل الدخول',
        text2: 'يرجى التحقق من رقم الهاتف وكلمة المرور',
        position: 'top',
        visibilityTime: 3000,
      });
    }

    setLoading(false);
  };

  // Handle Register
  const handleRegister = async () => {
    // Validation
    if (!formData.firstName) {
      Toast.show({
        type: 'error',
        text1: 'خطأ',
        text2: 'الاسم الأول مطلوب',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (!formData.lastName) {
      Toast.show({
        type: 'error',
        text1: 'خطأ',
        text2: 'الاسم الأخير مطلوب',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (!formData.coordinates) {
      Toast.show({
        type: 'error',
        text1: 'خطأ',
        text2: 'يرجى تحديد الموقع الجغرافي',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (!formData.phone) {
      Toast.show({
        type: 'error',
        text1: 'خطأ',
        text2: 'رقم الهاتف مطلوب',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (!validatePhone(formData.phone)) {
      Toast.show({
        type: 'error',
        text1: 'خطأ',
        text2: 'رقم الهاتف غير صحيح',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (formData.email && !validateEmail(formData.email)) {
      Toast.show({
        type: 'error',
        text1: 'خطأ',
        text2: 'البريد الإلكتروني غير صحيح',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (!formData.password) {
      Toast.show({
        type: 'error',
        text1: 'خطأ',
        text2: 'كلمة المرور مطلوبة',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (formData.password.length < 8) {
      Toast.show({
        type: 'error',
        text1: 'خطأ',
        text2: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'خطأ',
        text2: 'كلمة المرور غير متطابقة',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      // API call here
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email || undefined,
          password: formData.password,
          coordinates: formData.coordinates,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'نجح',
          text2: 'تم التسجيل بنجاح',
          position: 'top',
          visibilityTime: 2000,
        });
        
        // Switch to login mode with pre-filled phone and password
        setIsLogin(true);
        setFormData(prev => ({
          ...prev,
          phone: formData.phone,
          password: formData.password,
        }));
      } else {
        Toast.show({
          type: 'error',
          text1: 'خطأ',
          text2: data.message || 'فشل التسجيل',
          position: 'top',
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'خطأ',
        text2: 'حدث خطأ في الاتصال بالخادم',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Toggle between login and register
    const toggleAuthMode = () => {
      setIsLogin(!isLogin);
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        coordinates: null,
        address: null,
      });
    };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 pt-16 pb-8">
          {/* Logo/Header */}
          <View className="items-center mb-8">
            <View className="w-24 h-24 bg-emerald-500 rounded-full items-center justify-center mb-4">
              <Ionicons name="storefront" size={48} color="white" />
            </View>
            <Text className="text-3xl font-bold text-gray-80 mb-2">
              {isLogin ? 'مرحباً بعودتك' : 'إنشاء حساب جديد'}
            </Text>
            <Text className="text-gray-500 text-center">
              {isLogin
                ? 'سجل دخولك للمتابعة'
                : 'أنشئ حسابك وابدأ رحلتك معنا'}
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {/* First Name Field (Register only) */}
            {!isLogin && (
              <View>
                <Text className="text-gray-700 font-semibold mb-2 text-right">
                  الاسم الأول
                </Text>
                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                  <Ionicons name="person-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 text-right mr-3"
                    placeholder="أدخل الاسم الأول"
                    value={formData.firstName}
                    onChangeText={(value) => handleChange('firstName', value)}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            )}

            {/* Last Name Field (Register only) */}
            {!isLogin && (
              <View>
                <Text className="text-gray-700 font-semibold mb-2 text-right">
                  الاسم الأخير
                </Text>
                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                  <Ionicons name="person-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 text-right mr-3"
                    placeholder="أدخل الاسم الأخير"
                    value={formData.lastName}
                    onChangeText={(value) => handleChange('lastName', value)}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            )}

            {/* Phone Field */}
            <View>
              <Text className="text-gray-700 font-semibold mb-2 text-right">
                رقم الهاتف
              </Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <Ionicons name="call-outline" size={20} color="#9CA3AF" />
                <TextInput
                  className="flex-1 text-right mr-3"
                  placeholder="01xxxxxxxxx"
                  value={formData.phone}
                  onChangeText={(value) => handleChange('phone', value)}
                  keyboardType="phone-pad"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Email Field (Register only) */}
            {!isLogin && (
              <View>
                <Text className="text-gray-700 font-semibold mb-2 text-right">
                  البريد الإلكتروني (اختياري)
                </Text>
                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                  <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 text-right mr-3"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChangeText={(value) => handleChange('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            )}

            {/* Password Field */}
            <View>
              <Text className="text-gray-700 font-semibold mb-2 text-right">
                كلمة المرور
              </Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="ml-2"
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
                <TextInput
                  className="flex-1 text-right mr-3"
                  placeholder="أدخل كلمة المرور"
                  value={formData.password}
                  onChangeText={(value) => handleChange('password', value)}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Confirm Password Field (Register only) */}
            {!isLogin && (
              <View>
                <Text className="text-gray-700 font-semibold mb-2 text-right">
                  تأكيد كلمة المرور
                </Text>
                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                  <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 text-right mr-3"
                    placeholder="أعد إدخال كلمة المرور"
                    value={formData.confirmPassword}
                    onChangeText={(value) =>
                      handleChange('confirmPassword', value)
                    }
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            )}

            {/* Location Section (Register only) */}
            {!isLogin && (
              <View className="mt-4">
                <Text className="text-gray-700 font-semibold mb-2 text-right">
                  الموقع الجغرافي
                </Text>
                
                {/* Show address if available */}
                {formData.address ? (
                  <View className="bg-emerald-50 border-emerald-200 rounded-lg p-3 mb-2">
                    <Text className="text-emerald-70 text-sm text-right">
                      العنوان: {formData.address}
                    </Text>
                  </View>
                ) : (
                  <View className="bg-gray-50 border-gray-200 rounded-lg p-3 mb-2">
                    <Text className="text-gray-500 text-sm text-right">
                      لم يتم تحديد الموقع الجغرافي
                    </Text>
                  </View>
                )}

                {/* Get Current Location Button */}
                <TouchableOpacity
                  className="bg-blue-500 rounded-lg py-3 items-center"
                  onPress={getCurrentLocation}
                  activeOpacity={0.8}
                >
                  <Text className="text-white text-base font-semibold">
                    جلب الموقع الحالي
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Forgot Password (Login only) */}
            {isLogin && (
              <TouchableOpacity className="self-end">
                <Text className="text-emerald-500 font-semibold">
                  نسيت كلمة المرور؟
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className="bg-emerald-500 rounded-lg py-4 items-center mt-6"
            onPress={isLogin ? handleLogin : handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-lg font-bold">
                {isLogin ? 'تسجيل الدخول برقم الهاتف' : 'إنشاء حساب'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500">أو</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Social Login Buttons */}
          <View className="space-y-3">
            <TouchableOpacity
              className="flex-row items-center justify-center bg-white border border-gray-300 rounded-lg py-3"
              activeOpacity={0.8}
            >
              <Ionicons name="logo-google" size={20} color="#EA4335" />
              <Text className="text-gray-700 font-semibold mr-2">
                تسجيل الدخول بواسطة Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center justify-center bg-white border border-gray-300 rounded-lg py-3"
              activeOpacity={0.8}
            >
              <Ionicons name="logo-facebook" size={20} color="#1877F2" />
              <Text className="text-gray-700 font-semibold mr-2">
                تسجيل الدخول بواسطة Facebook
              </Text>
            </TouchableOpacity>
          </View>

          {/* Toggle Auth Mode */}
          <View className="flex-row justify-center items-center mt-6">
            <TouchableOpacity onPress={toggleAuthMode}>
              <Text className="text-emerald-500 font-bold">
                {isLogin ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
              </Text>
            </TouchableOpacity>
            <Text className="text-gray-600 ml-2">
              {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
            </Text>
          </View>

          {/* Terms and Privacy (Register only) */}
          {!isLogin && (
            <View className="mt-6">
              <Text className="text-gray-500 text-xs text-center leading-5">
                بالتسجيل، أنت توافق على{' '}
                <Text className="text-emerald-500 font-semibold">
                  الشروط والأحكام
                </Text>{' '}
                و{' '}
                <Text className="text-emerald-500 font-semibold">
                  سياسة الخصوصية
                </Text>
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Toast Container */}
      <Toast />
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;
