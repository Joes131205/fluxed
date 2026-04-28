import { router } from "expo-router";
import { fetchCurrentUser } from "../context/AuthContext";

export const requireAuth = async () => {
    const user = await fetchCurrentUser();
    if (!user) {
        router.replace("/sign-in");
    }
};
