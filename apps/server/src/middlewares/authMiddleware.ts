import { createMiddleware } from "hono/factory";
import { validateJWT } from "../utils/jwt";
import { jwtSecret } from "../env";

export const authCheck = createMiddleware(async (c, next) => {
    const authorization = c.req.header("Authorization");
    console.log("Authorization header:", authorization);

    const token = authorization?.split(" ")[1];
    if (!token) {
        console.log("No token found in Authorization header");
        return c.json({ ok: false, error: "Unauthorized" }, 401);
    }

    console.log("Token extracted:", token.substring(0, 20) + "...");

    let userId;

    try {
        userId = validateJWT(token, jwtSecret);
        console.log("Token validated successfully, userId:", userId);
    } catch (error) {
        console.error("Token validation failed:", error);
        return c.json({ ok: false, error: "Unauthorized" }, 401);
    }
    if (!userId) {
        console.log("No userId in token");
        return c.json({ ok: false, error: "Unauthorized" }, 401);
    }

    c.set("userId", userId);

    await next();
});
