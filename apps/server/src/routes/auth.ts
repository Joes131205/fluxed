import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { signUpSchema, logInSchema } from "../../../packages/shared/src/inputs";
import {
    createUser,
    getUserByEmail,
    getUserById,
} from "../../../packages/db/src/queries/users";

import { checkPasswordHash, hashPassword } from "../utils/auth";
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

        return c.json(
            {
                ok: true,
                id: user.id,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                email: user.email,
                token,
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
        return c.json(
            {
                ok: true,
                id: user.id,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                email: user.email,
                username: user.username,
                token,
            },
            200,
        );
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
    })
    .get("/google/callback", async (c) => {
        const code = c.req.query("code");
        if (!code) {
            return c.json({ ok: false, error: "Not Authorized" }, 403);
        }
        return c.json({ ok: true, code }, 200);
    });

export default app;
