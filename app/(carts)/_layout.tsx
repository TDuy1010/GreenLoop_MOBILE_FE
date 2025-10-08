import { Stack } from "expo-router";

export default function CartsLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen 
                name="index"
                options={{
                    title: "Giỏ hàng",
                }}
            />
            <Stack.Screen 
                name="checkout"
                options={{
                    title: "Thanh toán",
                    presentation: "card",
                }}
            />
        </Stack>
    );
}