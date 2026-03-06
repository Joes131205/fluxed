import { Hono } from "hono";
import { cors } from "hono/cors";
import usersRoute from "./routes/users";
import authRoute from "./routes/auth";

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
    .get("/", (c) => c.json({ ok: true }))
    .route("/users", usersRoute)
    .route("/auth", authRoute);

const routes = app.route("/api", app);

export type AppType = typeof routes;

export default {
    port: 3000,
    fetch: app.fetch,
};
