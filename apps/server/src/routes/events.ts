import { Hono } from "hono";
import {
    createEvent,
    deleteEvent,
    getEvents,
} from "../../../packages/db/src/queries/events";
import { authCheck } from "../middlewares/authMiddleware";
type AppType = {
    userId: string;
};

const app = new Hono<{ Variables: AppType }>()
    .get("/", authCheck, async (c) => {
        const userId = c.get("userId");
        const data = await getEvents(userId);
        return c.json({ ok: true, data }, 200);
    })
    // .post("/", zValidator("json", eventSchema), authCheck, async (c) => {
    //     const input = c.req.valid("json");
    //     const userId = c.get("userId");
    //     const data = await createEvent({
    //         ...input,
    //         user_id: userId,
    //     });
    //     return c.json({ ok: true, data }, 201);
    // })
    // .put("/:id", zValidator("json", areaSchema), authCheck, async (c) => {
    //     const input = c.req.valid("json");
    //     const userId = c.get("userId");
    //     const id = c.req.param("id");
    //     const data = await updateArea(id, {
    //         ...input,
    //         user_id: userId,
    //     });
    //     return c.json({ ok: true, data }, 200);
    // })
    .delete("/:id", authCheck, async (c) => {
        const id = c.req.param("id");
        await deleteEvent(id);
        return c.json({ ok: true }, 200);
    });

export default app;
