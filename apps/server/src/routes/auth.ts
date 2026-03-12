import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { signUpSchema, logInSchema } from "../../../packages/shared/src/inputs";
import {
    createUser,
    getUserByEmail,
    getUserById,
} from "../../../packages/db/src/queries/users";

import {
    getRefreshToken,
    revokeToken,
    storeRefreshToken,
} from "../../../packages/db/src/queries/refresh_tokens";

import {
    checkPasswordHash,
    hashPassword,
    makeRefreshToken,
} from "../utils/auth";
import { makeJWT, validateJWT } from "../utils/jwt";
import { jwtSecret } from "../env";
import { authCheck } from "../middlewares/authMiddleware";

type AppType = {
    userId: string;
};

const app = new Hono<{ Variables: AppType }>()
    .post("/register", zValidator("json", signUpSchema), async (c) => {
        const input = c.req.valid("json");
        const hashedPassword = await hashPassword(input.password);
        const user = await createUser({ ...input, password: hashedPassword });
        if (!user) {
            return c.json({ ok: false, error: "Email already exists" }, 409);
        }
        const token = makeJWT(user.id, 60 * 60, jwtSecret);
        const refreshToken = await makeRefreshToken();
        const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
        await storeRefreshToken({
            token: refreshToken,
            user_id: user.id,
            expires_at: expiresAt,
            revoked_at: null,
        });
        return c.json(
            {
                ok: true,
                id: user.id,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                email: user.email,
                token,
                refreshToken,
            },
            201,
        );
    })
    .post("/login", zValidator("json", logInSchema), async (c) => {
        const input = c.req.valid("json");
        console.log(input);

        const user = await getUserByEmail(input.email);

        if (
            !user ||
            !(await checkPasswordHash(input.password, user.password))
        ) {
            return c.json({ ok: false, error: "Invalid credentials" }, 401);
        }

        const token = makeJWT(user.id, 60 * 60, jwtSecret);
        const refreshToken = await makeRefreshToken();
        const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
        await storeRefreshToken({
            token: refreshToken,
            user_id: user.id,
            expires_at: expiresAt,
            revoked_at: null,
        });
        return c.json(
            {
                ok: true,
                id: user.id,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                email: user.email,
                username: user.username,
                token,
                refreshToken,
            },
            200,
        );
    })
    .post("/refresh", async (c) => {
        const authorization = c.req.header("Authorization");
        // Bearer <refresh_token>

        const token = authorization?.split(" ")[1];
        if (!token) {
            return c.json({ ok: false, error: "Unauthorized" }, 401);
        }
        const fetchedToken = await getRefreshToken(token);
        const dateNow = Date.now();
        if (
            !fetchedToken ||
            dateNow > fetchedToken.expires_at.getTime() ||
            fetchedToken.revoked_at
        ) {
            return c.json({ ok: false, error: "Unauthorized" }, 401);
        }

        const user = await getUserById(fetchedToken.user_id);

        if (!user) {
            return c.json({ ok: false, error: "Unauthorized" }, 401);
        }

        const jwtToken = makeJWT(user.id, 60 * 60, jwtSecret);

        return c.json({ ok: true, token: jwtToken }, 200);
    })
    .post("/revoke", async (c) => {
        const authorization = c.req.header("Authorization");
        // Bearer <refresh_token>

        const token = authorization?.split(" ")[1];
        if (!token) {
            return c.json({ ok: false, error: "Unauthorized" }, 401);
        }
        const fetchedToken = await getRefreshToken(token);
        const dateNow = Date.now();
        if (
            !fetchedToken ||
            dateNow > fetchedToken.expires_at.getTime() ||
            fetchedToken.revoked_at
        ) {
            return c.json({ ok: false, error: "Unauthorized" }, 401);
        }

        await revokeToken(fetchedToken.token);

        return c.body(null, 204);
    })
    .get("/me", authCheck, async (c) => {
        const userId = c.get("userId");
        const user = await getUserById(userId);

        if (!user) {
            return c.json({ ok: false, error: "User not found" }, 401);
        }

        return c.json(
            {
                ok: true,
                id: user.id,
                email: user.email,
                username: user.username,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            200,
        );
    });

export default app;
