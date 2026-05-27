import { apiClient } from "./nestjs/apiClient";

export const authClient = apiClient.auth;
export const areasClient = apiClient.areas;
export const subareasClient = apiClient.subareas;
export const plansClient = apiClient.plannedSession;
