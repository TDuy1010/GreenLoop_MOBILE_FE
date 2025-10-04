import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
        animation: 'slide_from_right',
      }}
    >
        <Stack.Screen
            name="index"
            options={{
                title: 'Chào mừng',
            }}
        />
        <Stack.Screen
        name="sign-in" 
        options={{
          title: 'Đăng nhập',
        }}
      />
      <Stack.Screen 
        name="sign-up" 
        options={{
          title: 'Đăng ký',
        }}
      />
    </Stack>
  );
}
