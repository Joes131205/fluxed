import { hc } from "hono/client";
import type { AppType } from "@app/server";
import { env } from "@/env";

export const client = hc<AppType>(env.VITE_API_URL);

export const auth = client.api.auth;
export const users = client.api.users;
