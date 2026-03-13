import { Hono } from "hono";
import { authCheck } from "../middlewares/authMiddleware";
import {
    createSubarea,
    deleteSubarea,
    getSubareaByArea,
    getSubareas,
    updateSubarea,
} from "../../../packages/db/src/queries/subareas";
import { zValidator } from "@hono/zod-validator";
import { subareaSchema } from "../../../packages/shared/src/inputs";

type AppType = {
    userId: string;
};

const app = new Hono<{ Variables: AppType }>()
    .get("/:id", authCheck, async (c) => {
        const id = c.req.param("id");
        const data = await getSubareaByArea(id);
        return c.json({ ok: true, data }, 200);
    })
    .post("/", zValidator("json", subareaSchema), authCheck, async (c) => {
        const input = c.req.valid("json");
        const data = await createSubarea(input);
        return c.json({ ok: true, data }, 201);
    })
    .put("/:id", zValidator("json", subareaSchema), authCheck, async (c) => {
        const input = c.req.valid("json");
        const id = c.req.param("id");
        const data = await updateSubarea(id, input);
        return c.json({ ok: true, data }, 200);
    })
    .delete("/:id", authCheck, async (c) => {
        const id = c.req.param("id");
        await deleteSubarea(id);
        return c.json({ ok: true }, 200);
    });

export default app;
