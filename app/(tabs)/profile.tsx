import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileScreen() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-1 items-center justify-center px-6">
                    <View className="w-24 h-24 rounded-full bg-green-50 items-center justify-center mb-6">
                        <Ionicons name="person-outline" size={48} color="#16A34A" />
                    </View>
                    
                    <Text className="text-2xl font-quicksandBold text-gray-800 mb-3 text-center">
                        Đăng nhập để tiếp tục
                    </Text>
                    
                    <Text className="text-gray-600 font-quicksand text-center mb-8">
                        Đăng nhập để xem hồ sơ, theo dõi eco-points và quản lý cài đặt của bạn
                    </Text>

                    <View className="w-full max-w-sm">
                        <CustomButton
                            title="Đăng nhập"
                            onPress={() => router.push('/(auth)/sign-in')}
                            className="mb-3"
                        />
                        
                        <CustomButton
                            title="Tạo tài khoản"
                            onPress={() => router.push('/(auth)/sign-up')}
                            variant="secondary"
                        />
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="p-6">
                <Text className="text-2xl font-quicksandBold text-gray-800 mb-2">
                    Bản thân
                </Text>
                <Text className="text-gray-600 font-quicksand">
                    Hồ sơ, eco-points và cài đặt.
                </Text>
            </View>
        </SafeAreaView>
    );
}
