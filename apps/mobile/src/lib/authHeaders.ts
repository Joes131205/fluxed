import AsyncStorage from "@react-native-async-storage/async-storage";

export const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
        throw new Error("No token found");
    }
    return {
        Authorization: `Bearer ${token}`,
    };
};
