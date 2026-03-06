import { hc } from "hono/client";
import type { AppType } from "../../../server/src/index";

export const client = hc<AppType>(
    process.env.API_URL || "http://localhost:3000",
);
