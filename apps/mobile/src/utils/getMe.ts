import axios from "axios";
import { API_URL } from "../lib/env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getMe = async () => {
    const token = await AsyncStorage.getItem("token");
    console.log(
        "Retrieved token from storage:",
        token?.substring(0, 30) + "...",
    );

    if (!token) return null;

    try {
        console.log("Attempting request to:", `${API_URL}/auth/me`);
        const response = await axios.get(`${API_URL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("getMe success response:", response);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("getMe axios error:", {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                headers: error.config?.headers,
            });
        } else {
            console.error("getMe error:", error);
        }
        return null;
    }
};
