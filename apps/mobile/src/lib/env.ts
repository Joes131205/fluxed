import { Platform } from "react-native";

const localDevApiUrl =
    Platform.select({
        android: "http://192.168.18.71",
        ios: "http://localhost",
        default: "http://localhost",
    }) || "http://localhost";

export const API_URL =
    process.env.EXPO_PUBLIC_API_URL ||
    (__DEV__ ? localDevApiUrl : "http://192.168.18.71");
