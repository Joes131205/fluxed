import { hc } from "hono/client";
import { API_URL } from "./env";

export const client = hc(API_URL) as any;

export const authClient = client.auth;
export const usersClient = client.users;
export const areasClient = client.areas;
export const subareasClient = client.subareas;
export const calendarsClient = client.calendars;
export const plansClient = client.plan;
