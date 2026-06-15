import { Hono } from "hono";
import { cors } from "hono/cors";
import usersRoute from "./routes/users";
import authRoute from "./routes/auth";
import areasRoute from "./routes/areas";
import subareasRoute from "./routes/subareas";
import calendarsRoute from "./routes/calendars";
import plannedSessionsRoute from "./routes/plannedSessions";
import actionsRoute from "./routes/actions";

const api = new Hono()
    .get("/", (c) => c.json({ ok: true }))
    .route("/users", usersRoute)
    .route("/auth", authRoute)
    .route("/areas", areasRoute)
    .route("/subareas", subareasRoute)
    .route("/calendars", calendarsRoute)
    .route("/plan", plannedSessionsRoute)
    .route("/actions", actionsRoute);

const app = new Hono().use(cors()).route("/", api);

export { app };
export default app;

export type AppType = typeof app;
