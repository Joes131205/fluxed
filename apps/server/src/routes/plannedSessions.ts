import { Hono } from "hono";
import { authCheck } from "../middlewares/authMiddleware";
import {
    deletePlan,
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

        const data = await getPlan(userId);

        return c.json({ ok: true, data }, 200);
    })
    .post(
        "/",
        zValidator("json", plannedSessionSchema),
        authCheck,
        async (c) => {
            const valid = c.req.valid("json");
            const data = await updatePlan(valid);

            return c.json({ ok: true, data }, 201);
        },
    )
    .delete("/", authCheck, async (c) => {
        const userId = c.get("userId");

        await deletePlan(userId);

        return c.json({ ok: true, message: "Deleted" }, 200);
    });

export default app;
