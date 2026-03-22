import { Hono } from "hono";
import { authCheck } from "../middlewares/authMiddleware";
import {
    getPlan,
    updatePlan,
} from "../../../packages/db/src/queries/plannedSessions";
import { zValidator } from "@hono/zod-validator";
import { plannedSessionSchema } from "../../../packages/shared/src/inputs";

type AppType = {
    userId: string;
};

const app = new Hono<{ Variables: AppType }>()
    .get("/", authCheck, async (c) => {
        const userId = c.get("userId");

        const data = getPlan(userId);

        return c.json({ ok: true, data }, 200);
    })
    .post(
        "/",
        zValidator("json", plannedSessionSchema),
        authCheck,
        async (c) => {
            const userId = c.get("userId");
            const valid = c.req.valid("json");
            const data = await updatePlan(userId, valid);

            return c.json({ ok: true, data }, 201);
        },
    );

export default app;
