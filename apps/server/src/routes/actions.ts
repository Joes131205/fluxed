import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
    actionSchema,
    updateActionSchema,
} from "../../../packages/shared/src/inputs";
import { authCheck } from "../middlewares/authMiddleware";
import {
    createAction,
    deleteAction,
    getAllActionsBySubarea,
    updateAction,
} from "../../../packages/db/src/queries/actions";

type AppType = {
    userId: string;
};

const app = new Hono<{ Variables: AppType }>()
    .post("/", authCheck, zValidator("json", actionSchema), async (c) => {
        const input = c.req.valid("json");
        try {
            const data = await createAction(input);

            return c.json({ ok: true, data: data }, 201);
        } catch (error) {
            return c.json({ ok: false, error: "Failed to create action" }, 500);
        }
    })
    .get("/:subareaId", authCheck, async (c) => {
        const id = c.req.param("subareaId");
        try {
            const data = await getAllActionsBySubarea(id);

            return c.json({ ok: true, data: data }, 201);
        } catch (error) {
            return c.json({ ok: false, error: "Failed to create action" }, 500);
        }
    })
    .patch(
        "/:id",
        authCheck,
        zValidator("json", updateActionSchema),
        async (c) => {
            const id = c.req.param("id");
            const input = c.req.valid("json");

            try {
                const updated = await updateAction(id, input);
                if (!updated) {
                    return c.json(
                        { ok: false, error: "Action not found" },
                        404,
                    );
                }

                return c.json({ ok: true, data: updated });
            } catch (error) {
                return c.json(
                    { ok: false, error: "Failed to update action" },
                    500,
                );
            }
        },
    )
    .delete("/:id", authCheck, async (c) => {
        const id = c.req.param("id");

        try {
            await deleteAction(id);
            return c.json({ ok: true }, 200);
        } catch (error) {
            return c.json({ ok: false, error: "Failed to delete action" }, 500);
        }
    });

export default app;
