import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";

export default function EventScreen() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ padding: 20 }}>
                <Text style={{ fontFamily: "Quicksand-Bold", fontSize: 22 }}>
                    Sự kiện
                </Text>
                <Text style={{ fontFamily: "Quicksand-Regular", marginTop: 6 }}>
                    Danh sách sự kiện xanh sắp diễn ra.
                </Text>
            </View>
        </SafeAreaView>
    );
}
