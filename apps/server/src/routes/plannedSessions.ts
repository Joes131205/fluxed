import { Hono } from "hono";
import { authCheck } from "../middlewares/authMiddleware";
import {
    deletePlan,
    getPlan,
    updatePlan,
} from "../../../packages/db/src/queries/plannedSessions";
import { zValidator } from "@hono/zod-validator";
import { plannedSessionSchema } from "../../../packages/shared/src/inputs";
import { getUserById } from "../../../packages/db/src/queries/users";
import {
    deleteCalendarEvents,
    getCalendarId,
    insertCalendarEvents,
} from "../utils/gcal";
import { refreshGoogleToken } from "../utils/google";

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
    .post(
        "/gcal",
        zValidator("json", plannedSessionSchema),
        authCheck,
        async (c) => {
            const userId = c.get("userId");
            const schedule = c.req.valid("json");
            const user = await getUserById(userId);

            if (!user || !user.googleRefreshToken) {
                return c.json({ ok: false, message: "Unauthorized" }, 403);
            }

            const { googleRefreshToken } = user;

            const accessToken = await refreshGoogleToken(googleRefreshToken);
            const calId = await getCalendarId(accessToken);

            await deleteCalendarEvents(accessToken, calId);
            await insertCalendarEvents(accessToken, calId, schedule);
        },
    )
    .delete("/", authCheck, async (c) => {
        const userId = c.get("userId");

        await deletePlan(userId);

        return c.json({ ok: true, message: "Deleted" }, 200);
    });

export default app;
