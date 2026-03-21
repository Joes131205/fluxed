import { Hono } from "hono";
import axios from "axios";
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
        const token = makeJWT(user.id, 60 * 60 * 24 * 30, jwtSecret);

        return c.json(
            {
                ok: true,
                id: user.id,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                email: user.email,
                googleId: user.googleId,
                googleRefreshToken: user.googleRefreshToken,
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

        const token = makeJWT(user.id, 60 * 60 * 24 * 30, jwtSecret);
        return c.json(
            {
                ok: true,
                id: user.id,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                email: user.email,
                username: user.username,
                googleId: user.googleId,
                googleRefreshToken: user.googleRefreshToken,
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
                googleId: user.googleId,
                googleRefreshToken: user.googleRefreshToken,
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
        const tokenResponse = await axios.post(
            "https://oauth2.googleapis.com/token",
            new URLSearchParams({
                code,
                client_id: googleClientId,
                client_secret: googleClientSecret,
                redirect_uri: googleRedirectURI,
                grant_type: "authorization_code",
            }).toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                validateStatus: () => true,
            },
        );
        const tokens = tokenResponse.data as {
            access_token?: string;
            refresh_token?: string;
            error?: string;
            error_description?: string;
        };

        if (
            tokenResponse.status >= 400 ||
            tokens.error ||
            !tokens.access_token
        ) {
            return c.json(
                {
                    ok: false,
                    error:
                        tokens.error_description ||
                        "Unable to complete Google OAuth token exchange",
                },
                400,
            );
        }

        const { access_token, refresh_token } = tokens;

        const userProfileResponse = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: { Authorization: `Bearer ${access_token}` },
                validateStatus: () => true,
            },
        );

        if (userProfileResponse.status >= 400) {
            return c.json(
                { ok: false, error: "Unable to fetch Google profile" },
                400,
            );
        }

        const userProfile = userProfileResponse.data as {
            email?: string;
            name?: string;
            sub?: string;
        };

        const { email, name, sub: googleId } = userProfile;

        if (!email || !name || !googleId) {
            return c.json(
                { ok: false, error: "Incomplete Google profile data" },
                400,
            );
        }

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

        const token = makeJWT(user.id, 60 * 60 * 24 * 30, jwtSecret);
        console.log(token);
        return c.redirect(`http://localhost:3001/auth-success?token=${token}`);
    });

export default app;
