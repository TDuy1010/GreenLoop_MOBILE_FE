/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}", 
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: "#FE8C00",
                white: {
                    DEFAULT: "#FFFFFF",
                    100: "#FAFAFA",
                },
                gray: {
                    50: "#F9FAFB",
                    100: "#878787",
                    200: "#E5E7EB",
                    600: "#4B5563",
                    700: "#374151",
                    800: "#1F2937",
                },
                green: {
                    50: "#F0FDF4",
                    200: "#BBF7D0",
                    600: "#16A34A",
                    700: "#15803D",
                    800: "#166534",
                },
                red: {
                    500: "#EF4444",
                },
                dark: {
                    100: "#181C2E",
                },
                error: "#F14141",
                success: "#2F9B65",
            },
            fontFamily: {
                quicksand: ["Quicksand-Regular", "sans-serif"],
                quicksandBold: ["Quicksand-Bold", "sans-serif"],
                quicksandMedium: ["Quicksand-Medium", "sans-serif"],
                quicksandLight: ["Quicksand-Light", "sans-serif"],
                quicksandSemiBold: ["Quicksand-SemiBold", "sans-serif"],
            },
        },
    },
    plugins: [],
};
