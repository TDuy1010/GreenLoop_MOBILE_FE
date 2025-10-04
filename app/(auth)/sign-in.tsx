import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';

const MOCK_USER = {
  email: 'user@example.com',
  password: 'password123',
  name: 'John Doe'
};

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = 'Email là bắt buộc';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email không hợp lệ';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setLoading(true);

    setTimeout(() => {
      if (email === MOCK_USER.email && password === MOCK_USER.password) {
        Alert.alert('Thành công', `Chào mừng ${MOCK_USER.name}!`, [
          { text: 'OK', onPress: () => router.replace('/(tabs)') }
        ]);
      } else {
        Alert.alert('Lỗi', 'Email hoặc mật khẩu không đúng');
      }
      setLoading(false);
    }, 1500);
  };

  const fillMockCredentials = () => {
    setEmail(MOCK_USER.email);
    setPassword(MOCK_USER.password);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="px-6 pt-4">
            <TouchableOpacity
              onPress={() => router.replace('/(auth)')}
              className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center"
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View className="flex-1 px-6 pt-8">
            {/* Title Section */}
            <View className="mb-10">
              <Text className="text-sm text-gray-500 mb-2 font-quicksand">
                ĐĂNG NHẬP
              </Text>
              <Text className="text-4xl font-quicksandBold text-gray-800 mb-2">
                Chào mừng
              </Text>
              <Text className="text-4xl font-quicksandBold text-gray-800">
                trở lại! 🌱
              </Text>
            </View>

            {/* Mock Credentials Info */}
            <TouchableOpacity
              onPress={fillMockCredentials}
              className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center mb-2">
                <Ionicons name="information-circle" size={20} color="#16A34A" />
                <Text className="text-green-800 font-quicksandSemiBold ml-2">
                  Tài khoản thử nghiệm
                </Text>
              </View>
              <Text className="text-green-700 text-sm font-quicksand">
                Nhấn vào đây để điền thông tin mẫu
              </Text>
              <Text className="text-green-600 text-xs font-quicksand mt-1">
                {MOCK_USER.email}
              </Text>
            </TouchableOpacity>

            {/* Form */}
            <View className="mb-6">
              <CustomInput
                label="Email"
                placeholder="your@email.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                keyboardType="email-address"
                error={errors.email}
              />

              <CustomInput
                label="Mật khẩu"
                placeholder="••••••••"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                secureTextEntry
                error={errors.password}
              />

              <TouchableOpacity className="self-end mb-6">
                <Text className="text-green-600 font-quicksandSemiBold">
                  Quên mật khẩu?
                </Text>
              </TouchableOpacity>

              <CustomButton
                title="Đăng nhập"
                onPress={handleSignIn}
                loading={loading}
              />
            </View>

            {/* Footer */}
            <View className="flex-row justify-center items-center mt-4">
              <Text className="text-gray-600 font-quicksand">
                Chưa có tài khoản?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
                <Text className="text-green-600 font-quicksandSemiBold">
                  Đăng ký ngay
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
