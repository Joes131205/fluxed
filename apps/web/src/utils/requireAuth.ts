import { redirect } from "@tanstack/react-router";
import { getMe } from "./getMe";

export const requireAuth = async () => {
    const user = await getMe();
    if (!user) {
        throw redirect({ to: "/sign-in", search: { redirect: location.href } });
    }
    return { user };
};
