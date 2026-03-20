import { hc } from "hono/client";
import type { AppType } from "@app/server";
import { env } from "@/env";

export const client = hc<AppType>(env.VITE_API_URL);

export const authClient = client.api.auth;
export const usersClient = client.api.users;
export const areasClient = client.api.areas;
export const subareasClient = client.api.subareas;
export const calendarsClient = client.api.calendars;
