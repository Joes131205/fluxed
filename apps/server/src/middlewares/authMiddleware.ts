import { validateJWT } from "../utils/jwt";
import { jwtSecret } from "../env";
import { bearerAuth } from "hono/bearer-auth";

export const authCheck = bearerAuth({
    verifyToken: async (token, c) => {
        try {
            const userId = validateJWT(token, jwtSecret);
            c.set("userId", userId);
            return true;
        } catch (error) {
            console.error("Token validation failed:", error);
            return false;
        }
    },
});
