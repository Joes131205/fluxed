import axios from "axios";

export const getMe = async (accessToken?: string) => {
    const token = accessToken || localStorage.getItem("token");
    if (!token) return null;

    try {
        const response = await axios.get(
            `${process.env.API_URL || "http://localhost:3000"}/api/auth/me`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        return response.data;
    } catch (error) {
        return null;
    }
};
