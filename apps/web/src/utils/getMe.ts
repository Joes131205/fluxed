import { env } from "@/env";
import axios from "axios";

export const getMe = async (accessToken?: string) => {
    const token = accessToken || localStorage.getItem("token");
    if (!token) return null;

    try {
        const { data } = await axios.get(`${env.VITE_API_URL}/api/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data.ok ? data : null;
    } catch (error) {
        return null;
    }
};
