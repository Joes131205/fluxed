import { Hono } from "hono";
import { authCheck } from "../middlewares/authMiddleware";

type AppType = {
    userId: string;
};

const app = new Hono<{ Variables: AppType }>();

export default app;
