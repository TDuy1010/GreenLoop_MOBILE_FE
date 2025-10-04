import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";

export default function HomeScreen() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ padding: 20 }}>
                <Text style={{ fontFamily: "Quicksand-Bold", fontSize: 22 }}>
                    Trang chủ
                </Text>
                <Text style={{ fontFamily: "Quicksand-Regular", marginTop: 6 }}>
                    Chào mừng đến GreenLoop 👕🌿
                </Text>
            </View>
        </SafeAreaView>
    );
}
