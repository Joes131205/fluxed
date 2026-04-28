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
        const url = `${API_URL}/auth/me`;
        console.log("API_URL:", API_URL);
        console.log("Full request URL:", url);
        console.log(
            "Authorization header value:",
            `Bearer ${token?.substring(0, 30)}...`,
        );

        const response = await axios.get(url, {
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
