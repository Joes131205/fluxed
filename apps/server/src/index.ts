import { Hono } from "hono";
import { cors } from "hono/cors";
import usersRoute from "./routes/users";
import authRoute from "./routes/auth";
import areasRoute from "./routes/areas";
import subareasRoute from "./routes/subareas";
import calendarsRoute from "./routes/calendars";

const api = new Hono()
    .get("/", (c) => c.json({ ok: true }))
    .route("/users", usersRoute)
    .route("/auth", authRoute)
    .route("/areas", areasRoute)
    .route("/subareas", subareasRoute)
    .route("/calendars", calendarsRoute);

const app = new Hono()
    .use(
        "/api/*",
        cors({
            allowMethods: ["POST", "GET", "OPTIONS", "PUT"],
            origin: [
                "http://localhost:3001",
                "http://localhost:3000",
                "http://localhost:8081",
            ],
            allowHeaders: ["Content-Type", "Authorization"],
            credentials: true,
        }),
    )
    .route("/api", api);

export { app };

export type AppType = typeof app;

export default {
    port: 3000,
    fetch: app.fetch,
};
