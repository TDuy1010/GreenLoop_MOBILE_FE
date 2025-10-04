import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabsLayout() {

    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                tabBarActiveTintColor: "#16A34A",
                tabBarInactiveTintColor: "#878787",
                headerTitleStyle: { fontFamily: "Quicksand-Bold" },
                tabBarLabelStyle: { fontFamily: "Quicksand-Medium" },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Trang chủ",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="event"
                options={{
                    title: "Sự kiện",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="calendar-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="leaderboard"
                options={{
                    title: "Bảng xếp hạng",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="trophy-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Trang cá nhân",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-circle-outline" color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    );
}
