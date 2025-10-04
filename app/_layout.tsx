import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";
import {AuthProvider} from "@/contexts/AuthContext";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
    // no-op if already prevented
});

export default function RootLayout() {
    const [fontsLoaded, error] = useFonts({
        "Quicksand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
        "Quicksand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
        "Quicksand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
        "Quicksand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
        "Quicksand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
    });

    useEffect(() => {
        if (error) throw error;
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, error]);

    if (!fontsLoaded) return null;

    return (
        <>
            <AuthProvider>
                <Stack screenOptions={{ headerShown: false }} />
            </AuthProvider>
        </>
    );
}
