import { createMiddleware } from "hono/factory";
import { validateJWT } from "../utils/jwt";
import { jwtSecret } from "../env";
import { bearerAuth } from "hono/bearer-auth";

export const authCheck = bearerAuth({
    verifyToken: async (token, c) => {
        try {
            console.log(
                "bearerAuth verifying token:",
                token.substring(0, 20) + "...",
            );
            const userId = validateJWT(token, jwtSecret);
            console.log("Token validated successfully, userId:", userId);
            c.set("userId", userId);
            return true;
        } catch (error) {
            console.error("Token validation failed:", error);
            return false;
        }
    },
});
