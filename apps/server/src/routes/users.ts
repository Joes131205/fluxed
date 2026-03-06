import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { validateJWT } from "../utils/jwt";
import { hashPassword } from "../utils/auth";
import { updateUser } from "../../../packages/db/src/queries/users";

const app = new Hono();

app.put(
    "/",
    zValidator(
        "json",
        z.object({
            email: z.email(),
            password: z.string(),
        }),
    ),
    async (c) => {
        const input = c.req.valid("json");
        // Access Token
        const authorization = c.req.header("Authorization");
        // Bearer <refresh_token>

        const token = authorization?.split(" ")[1];

        if (!token) {
            return c.json({ ok: false, error: "Unauthorized" }, 401);
        }

        let userId;

        try {
            userId = validateJWT(
                token,
                process.env.JWT_SECRET || "random_secret",
            );
        } catch (error) {
            return c.json({ ok: false, error: "Unauthorized" }, 401);
        }

        if (!userId) {
            return c.json({ ok: false, error: "Unauthorized" }, 401);
        }

        const hashedPassword = await hashPassword(input.password);
        const updated = await updateUser(userId, input.email, hashedPassword);
        if (!updated) return c.json({ ok: false, error: "Not found" }, 404);

        return c.json(
            {
                ok: true,
                id: updated.id,
                email: updated.email,
                createdAt: updated.createdAt,
                updatedAt: updated.updatedAt,
            },
            200,
        );
    },
);

export type UserRoute = typeof app;

export default app;
