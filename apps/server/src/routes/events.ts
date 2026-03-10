import { Hono } from "hono";
import {
    createEvent,
    deleteEvent,
    getEventsBySubarea,
    updateEvent,
} from "../../../packages/db/src/queries/events";
import { authCheck } from "../middlewares/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import { eventSchema } from "../../../packages/shared/src";

type AppType = {
    userId: string;
};

const app = new Hono<{ Variables: AppType }>()
    .get("/", authCheck, async (c) => {
        const userId = c.get("userId");
        const data = await getEventsBySubarea(userId);
        return c.json({ ok: true, data }, 200);
    })
    .post("/", zValidator("json", eventSchema), authCheck, async (c) => {
        const input = c.req.valid("json");
        const data = await createEvent(input);
        return c.json({ ok: true, data }, 201);
    })
    .put("/:id", zValidator("json", eventSchema), authCheck, async (c) => {
        const input = c.req.valid("json");
        const id = c.req.param("id");
        const data = await updateEvent(id, input);
        return c.json({ ok: true, data }, 200);
    })
    .delete("/:id", authCheck, async (c) => {
        const id = c.req.param("id");
        await deleteEvent(id);
        return c.json({ ok: true }, 200);
    });

export default app;
