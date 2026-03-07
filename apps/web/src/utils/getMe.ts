import { client } from "@/lib/client";

export const getMe = async (accessToken?: string) => {
    const token = accessToken || localStorage.getItem("token");
    if (!token) return null;

    try {
        const response = await client.api.auth.me.$get(
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        const data = await response.json();
        return data.ok ? data : null;
    } catch (error) {
        return null;
    }
};
