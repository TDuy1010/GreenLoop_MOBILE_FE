import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';

const SignUp = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', password: '', confirmPassword: '' };

    if (!name.trim()) {
      newErrors.name = 'Tên là bắt buộc';
      isValid = false;
    }

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

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);

    setTimeout(() => {
      Alert.alert('Thành công', 'Tài khoản đã được tạo!', [
        { text: 'OK', onPress: () => router.replace('/(auth)/sign-in') }
      ]);
      setLoading(false);
    }, 1500);
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
          <View className="flex-1 px-6 pt-8 pb-6">
            {/* Title Section */}
            <View className="mb-8">
              <Text className="text-sm text-gray-500 mb-2 font-quicksand">
                TẠO TÀI KHOẢN
              </Text>
              <Text className="text-4xl font-quicksandBold text-gray-800 mb-2">
                Chào bạn mới! 👋
              </Text>
              <Text className="text-gray-600 font-quicksand">
                Tạo tài khoản để bắt đầu hành trình xanh
              </Text>
            </View>

            {/* Form */}
            <View className="mb-6">
              <CustomInput
                label="Họ và tên"
                placeholder="Nguyễn Văn A"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                error={errors.name}
              />

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

              <CustomInput
                label="Xác nhận mật khẩu"
                placeholder="••••••••"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                }}
                secureTextEntry
                error={errors.confirmPassword}
              />

              <CustomButton
                title="Tạo tài khoản"
                onPress={handleSignUp}
                loading={loading}
                className="mt-2"
              />
            </View>

            {/* Terms */}
            <Text className="text-gray-500 text-xs text-center mb-4 font-quicksand">
              Bằng cách đăng ký, bạn đồng ý với{' '}
              <Text className="text-green-600">Điều khoản dịch vụ</Text>
              {' '}và{' '}
              <Text className="text-green-600">Chính sách bảo mật</Text>
            </Text>

            {/* Footer */}
            <View className="flex-row justify-center items-center">
              <Text className="text-gray-600 font-quicksand">
                Đã có tài khoản?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
                <Text className="text-green-600 font-quicksandSemiBold">
                  Đăng nhập
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
