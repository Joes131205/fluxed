import { Hono } from "hono";
import { authCheck } from "../middlewares/authMiddleware";
import { withRouteError } from "../utils/withRouteError";
import {
    createSubarea,
    deleteSubarea,
    getSubareaByArea,
    updateSubarea,
} from "../../../packages/db/src/queries/subareas";
import { zValidator } from "@hono/zod-validator";
import { subareaSchema } from "../../../packages/shared/src/inputs";

type AppType = {
    userId: string;
};

const app = new Hono<{ Variables: AppType }>()
    .get("/:id", withRouteError, authCheck, async (c) => {
        const id = c.req.param("id");
        const data = await getSubareaByArea(id);
        return c.json({ ok: true, data }, 200);
    })
    .post(
        "/",
        withRouteError,
        zValidator("json", subareaSchema),
        authCheck,
        async (c) => {
            const userId = c.get("userId");
            const input = c.req.valid("json");
            const data = await createSubarea({ user_id: userId, ...input });
            return c.json({ ok: true, data }, 201);
        },
    )
    .put(
        "/:id",
        withRouteError,
        zValidator("json", subareaSchema),
        authCheck,
        async (c) => {
            const input = c.req.valid("json");
            console.log(input);
            const id = c.req.param("id");
            const data = await updateSubarea(id, input);
            console.log(data);
            return c.json({ ok: true, data }, 200);
        },
    )
    .delete("/:id", withRouteError, authCheck, async (c) => {
        const id = c.req.param("id");
        await deleteSubarea(id);
        return c.json({ ok: true }, 200);
    });

export default app;
