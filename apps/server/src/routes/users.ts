import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authCheck } from "../middlewares/authMiddleware";
import { timeSchema } from "../../../packages/shared/src/inputs";

type AppType = {
    userId: string;
};

const app = new Hono<{ Variables: AppType }>().put(
    "/time",
    zValidator("json", timeSchema),
    authCheck,
    async (c) => {
        const userId = c.get("userId");
        const time = c.req.valid("json");
    },
);

export type CalendarRoute = typeof app;

export default app;
