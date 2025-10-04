import React from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '@/components/CustomButton';

const { width, height } = Dimensions.get('window');

const Welcome = () => {
  const router = useRouter();

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <View className="flex-1 bg-white">
      {/* Close Button */}
      <SafeAreaView edges={['top']} className="absolute top-0 right-0 z-10">
        <TouchableOpacity
          onPress={handleSkip}
          className="m-4 w-10 h-10 rounded-full bg-white/90 items-center justify-center shadow-lg"
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={24} color="#374151" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Hero Image */}
      <View className="relative" style={{ height: height * 0.65 }}>
        <Image
          source={require('@/assets/images/background-auth.jpg')}
          style={{ width: '100%', height: '90%' }}
          resizeMode="cover"
        />
        
        {/* Gradient Overlay */}
        <View className="absolute bottom-0 left-0 right-0" style={{ height: 150 }}>
          <LinearGradient
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.95)', 'rgba(255,255,255,1)']}
            style={{ flex: 1 }}
          />
        </View>
      </View>

      {/* Content */}
      <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
        <View className="flex-1 px-6 justify-end pb-8">
          <Text className="text-gray-500 text-center text-md mb-2 font-quicksand uppercase tracking-wider">
            Chào mừng đến với GreenLoop
          </Text>
          
          <Text className="text-4xl font-quicksandBold text-center text-gray-800 mb-1">
            Hãy cùng chúng tôi
          </Text>
          
          <View className="flex-row justify-center items-center mb-8">
            <Text className="text-4xl font-quicksandBold text-gray-800">
              Bảo vệ{' '}
            </Text>
            <Text className="text-3xl font-quicksandBold text-green-600">
              Môi trường
            </Text>
          </View>

          <CustomButton
            title="Đăng nhập"
            onPress={() => router.push('/(auth)/sign-in')}
            className="mb-3"
          />
          
          <CustomButton
            title="Tạo tài khoản"
            onPress={() => router.push('/(auth)/sign-up')}
            variant="secondary"
            className="mb-3"
          />

          {/* Skip Link */}
          <TouchableOpacity onPress={handleSkip} className="py-2">
            <Text className="text-center text-gray-400 font-quicksand">
              Bỏ qua và khám phá →
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Welcome;