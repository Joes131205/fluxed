import { router } from "expo-router";
import { getMe } from "./getMe";

export const requireAuth = async () => {
    const user = await getMe();
    if (!user) {
        router.replace("/sign-in");
        return null;
    }
    return { user };
};
