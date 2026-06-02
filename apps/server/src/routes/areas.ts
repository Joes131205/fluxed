import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { areaSchema } from "../../../packages/shared/src/inputs";
import { authCheck } from "../middlewares/authMiddleware";
import { withRouteError } from "../utils/withRouteError";
import {
    createArea,
    deleteArea,
    getAreas,
    updateArea,
} from "../../../packages/db/src/queries/areas";

type AppType = {
    userId: string;
};

const app = new Hono<{ Variables: AppType }>()
    .get("/", withRouteError, authCheck, async (c) => {
        const userId = c.get("userId");
        const data = await getAreas(userId);
        console.log(data);
        return c.json({ ok: true, data }, 200);
    })
    .post("/", withRouteError, zValidator("json", areaSchema), authCheck, async (c) => {
        const input = c.req.valid("json");
        const userId = c.get("userId");
        const data = await createArea({
            ...input,
            user_id: userId,
        });
        return c.json({ ok: true, data }, 201);
    })
    .put("/:id", withRouteError, zValidator("json", areaSchema), authCheck, async (c) => {
        const input = c.req.valid("json");
        const userId = c.get("userId");
        const id = c.req.param("id");
        const data = await updateArea(id, {
            ...input,
            user_id: userId,
        });
        return c.json({ ok: true, data }, 200);
    })
    .delete("/:id", withRouteError, authCheck, async (c) => {
        const id = c.req.param("id");
        await deleteArea(id);
        return c.json({ ok: true }, 200);
    });

export default app;
