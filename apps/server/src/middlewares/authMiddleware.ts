import { createMiddleware } from "hono/factory";
import { validateJWT } from "../utils/jwt";
import { jwtSecret } from "../env";

export const authCheck = createMiddleware(async (c, next) => {
    const authorization = c.req.header("Authorization");
    const token = authorization?.split(" ")[1];
    if (!token) {
        return c.json({ ok: false, error: "Unauthorized" }, 401);
    }

    let userId;

    try {
        userId = validateJWT(token, jwtSecret);
    } catch (error) {
        return c.json({ ok: false, error: "Unauthorized" }, 401);
    }
    if (!userId) {
        return c.json({ ok: false, error: "Unauthorized" }, 401);
    }

    c.set("userId", userId);

    await next();
});
