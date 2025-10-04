import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";

export default function LeaderboardScreen() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ padding: 20 }}>
                <Text style={{ fontFamily: "Quicksand-Bold", fontSize: 22 }}>
                    Bảng xếp hạng
                </Text>
                <Text style={{ fontFamily: "Quicksand-Regular", marginTop: 6 }}>
                    Top người dùng theo Eco-Points.
                </Text>
            </View>
        </SafeAreaView>
    );
}
