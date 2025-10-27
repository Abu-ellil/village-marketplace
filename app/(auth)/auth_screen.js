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

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

    try {
      // API call here
      const response = await fetch('YOUR_API_URL/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'نجح',
          text2: 'تم تسجيل الدخول بنجاح',
          position: 'top',
          visibilityTime: 2000,
        });
        // Handle successful login (save token, navigate, etc.)
        // await AsyncStorage.setItem('token', data.token);
        // navigation.navigate('Home');
      } else {
        Toast.show({
          type: 'error',
          text1: 'خطأ',
          text2: data.message || 'فشل تسجيل الدخول',
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

  // Handle Register
  const handleRegister = async () => {
    // Validation
    if (!formData.name) {
      Toast.show({
        type: 'error',
        text1: 'خطأ',
        text2: 'الاسم مطلوب',
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
      const response = await fetch('YOUR_API_URL/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || undefined,
          password: formData.password,
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
        // Navigate to OTP verification screen
        // navigation.navigate('OTPVerification', { phone: formData.phone });
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
      name: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
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
            <Text className="text-3xl font-bold text-gray-800 mb-2">
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
            {/* Name Field (Register only) */}
            {!isLogin && (
              <View>
                <Text className="text-gray-700 font-semibold mb-2 text-right">
                  الاسم
                </Text>
                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                  <Ionicons name="person-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 text-right mr-3"
                    placeholder="أدخل اسمك"
                    value={formData.name}
                    onChangeText={(value) => handleChange('name', value)}
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
                {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}
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