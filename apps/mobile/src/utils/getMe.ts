import axios from "axios";
import { API_URL } from "../lib/env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getMe = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return null;

    try {
        const response = await axios.get(`${API_URL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return null;
    }
};
