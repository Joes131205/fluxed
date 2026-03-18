import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { signUpSchema, logInSchema } from "../../../packages/shared/src/inputs";
import {
    createUser,
    getUserByEmail,
    getUserById,
    updateUser,
} from "../../../packages/db/src/queries/users";

import { checkPasswordHash, hashPassword } from "../utils/auth";
import { makeJWT, validateJWT } from "../utils/jwt";
import {
    googleClientId,
    googleClientSecret,
    googleOAuthScopes,
    googleRedirectURI,
    jwtSecret,
} from "../env";
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
        const token = makeJWT(user.id, 60 * 60 * 60 * 24 * 30, jwtSecret);

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
            !(await checkPasswordHash(input.password, user.password!))
        ) {
            return c.json({ ok: false, error: "Invalid credentials" }, 401);
        }

        const token = makeJWT(user.id, 60 * 60 * 60 * 24 * 30, jwtSecret);
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
    .get("/google/start", async (c) => {
        return c.redirect(
            `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${googleRedirectURI}&response_type=code&scope=${googleOAuthScopes}&access_type=offline&prompt=consent`,
        );
    })
    .get("/google/callback", async (c) => {
        const code = c.req.query("code");
        if (!code) {
            return c.json({ ok: false, error: "Not Authorized" }, 403);
        }
        const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            body: new URLSearchParams({
                code,
                client_id: googleClientId,
                client_secret: googleClientSecret,
                redirect_uri: googleRedirectURI,
                grant_type: "authorization_code",
            }),
        });
        const tokens = await response.json();

        if (tokens.error) {
            return c.json({ ok: false, error: tokens.error_description }, 400);
        }

        const { access_token, refresh_token } = tokens;

        const userProfileResponse = await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: { Authorization: `Bearer ${access_token}` },
            },
        );

        const userProfile = await userProfileResponse.json();

        const { email, name, sub: googleId } = userProfile;

        let user = await getUserByEmail(email);

        if (!user) {
            user = await createUser({
                email,
                username: name,
                googleRefreshToken: refresh_token,
                googleId,
            });
        } else {
            if (!user.googleRefreshToken && !user.googleId) {
                user = await updateUser(user.id, {
                    googleRefreshToken: refresh_token,
                    googleId,
                    email: user.email,
                    username: user.username,
                });
            }
        }

        const token = makeJWT(user.id, 60 * 60 * 60 * 24 * 30, jwtSecret);

        return c.json(
            {
                ok: true,
                token,
            },
            200,
        );
    });

export default app;
