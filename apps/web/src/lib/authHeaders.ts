export const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No token found");
    }
    return {
        Authorization: `Bearer ${token}`,
    };
};
