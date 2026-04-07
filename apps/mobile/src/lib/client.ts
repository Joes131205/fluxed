import { hc } from "hono/client";
import { API_URL } from "./env";

export const client = hc(API_URL) as any;

export const authClient = client.api.auth;
export const usersClient = client.api.users;
export const areasClient = client.api.areas;
export const subareasClient = client.api.subareas;
export const calendarsClient = client.api.calendars;
export const plansClient = client.api.plan;
