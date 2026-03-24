import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authCheck } from "../middlewares/authMiddleware";
import { timeSchema } from "../../../packages/shared/src/inputs";
import { updateTime, updateUser } from "../../../packages/db/src/queries/users";
import z from "zod";
import { validateJWT } from "../utils/jwt";
import { userSchema } from "../../../packages/shared/src/inputs";

type AppType = {
    userId: string;
};

const app = new Hono<{ Variables: AppType }>()
    .put("/time", zValidator("json", timeSchema), authCheck, async (c) => {
        const userId = c.get("userId");
        const time = c.req.valid("json");

        await updateTime(userId, time);

        return c.json({ ok: true, message: "Updated" }, 200);
    })
    .put("/", zValidator("json", userSchema), authCheck, async (c) => {
        const input = c.req.valid("json");
        const userId = c.get("userId");
        const updated = await updateUser(userId, input);
        if (!updated) return c.json({ ok: false, error: "Not found" }, 404);

        return c.json(
            {
                ok: true,
            },
            200,
        );
    });

export type CalendarRoute = typeof app;

export default app;
