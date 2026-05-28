import { Platform } from "react-native";

const localDevApiUrl =
    Platform.select({
        android: "http://192.168.18.3:3000",
        ios: "http://localhost:3000",
        default: "http://localhost:3000",
    }) || "http://localhost:3000";

export const API_URL =
    process.env.EXPO_PUBLIC_API_URL ||
    (__DEV__ ? localDevApiUrl : "https://fluxed-server.vercel.app");
