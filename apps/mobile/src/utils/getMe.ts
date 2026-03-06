export const getMe = async (accessToken?: string) => {
    const token = accessToken || localStorage.getItem("token");
    if (!token) return null;

    try {
        const response = await fetch(
            `${process.env.API_URL || "http://localhost:3000"}/api/auth/me`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        if (!response.ok) return null;
        const data = await response.json();
        return data;
    } catch (error) {
        return null;
    }
};
