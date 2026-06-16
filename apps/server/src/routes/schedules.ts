import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { scheduleSchema } from "../../../packages/shared/src/inputs";
import { authCheck } from "../middlewares/authMiddleware";
import {
    createSchedule,
    deleteSchedule,
    getSchedulesByUser,
    updateSchedule,
} from "../../../packages/db/src/queries/schedules";

type AppType = {
    userId: string;
};

const app = new Hono<{ Variables: AppType }>()
    .post("/", authCheck, zValidator("json", scheduleSchema), async (c) => {
        const userId = c.get("userId");
        const input = c.req.valid("json");

        try {
            const data = await createSchedule({
                user_id: userId,
                name: input.name,
                timeSlots: input.timeSlots,
            });

            return c.json({ ok: true, data }, 201);
        } catch (error) {
            return c.json(
                { ok: false, error: "Failed to create schedule" },
                500,
            );
        }
    })

    .get("/", authCheck, async (c) => {
        const userId = c.get("userId");

        try {
            const data = await getSchedulesByUser(userId);
            return c.json({ ok: true, data }, 200);
        } catch (error) {
            return c.json(
                { ok: false, error: "Failed to fetch schedules" },
                500,
            );
        }
    })

    .patch("/:id", authCheck, zValidator("json", scheduleSchema), async (c) => {
        const id = c.req.param("id");
        const userId = c.get("userId");
        const input = c.req.valid("json");

        try {
            const updated = await updateSchedule(id, userId, input);

            if (!updated) {
                return c.json(
                    { ok: false, error: "Schedule not found or unauthorized" },
                    404,
                );
            }

            return c.json({ ok: true, data: updated }, 200);
        } catch (error) {
            return c.json(
                { ok: false, error: "Failed to update schedule" },
                500,
            );
        }
    })

    .delete("/:id", authCheck, async (c) => {
        const id = c.req.param("id");
        const userId = c.get("userId");

        try {
            await deleteSchedule(id, userId);
            return c.json({ ok: true }, 200);
        } catch (error) {
            return c.json(
                { ok: false, error: "Failed to delete schedule" },
                500,
            );
        }
    });

export default app;
