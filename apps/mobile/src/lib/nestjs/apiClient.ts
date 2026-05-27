import axios, { AxiosInstance } from "axios";
import { getAuthHeaders } from "../authHeaders";
import { API_URL } from "../env";

const SERVICES = {
    AUTH: `${API_URL}:3002`,
    CATEGORY: `${API_URL}:3003`,
    PLANNED_SESSION: `${API_URL}:3004`,
};

const createServiceClient = (baseURL: string): AxiosInstance => {
    return axios.create({
        baseURL,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

const authClient = createServiceClient(SERVICES.AUTH);
const categoryClient = createServiceClient(SERVICES.CATEGORY);
const plannedSessionClient = createServiceClient(SERVICES.PLANNED_SESSION);

export const auth = {
    register: async (email: string, password: string, name: string) => {
        const response = await authClient.post("/register", {
            email,
            password,
            name,
        });
        return response.data;
    },

    login: async (email: string, password: string) => {
        console.log(SERVICES.AUTH);
        const response = await authClient.post("/login", {
            email,
            password,
        });
        return response.data;
    },

    getMe: async (token: string) => {
        const headers = await getAuthHeaders();
        const response = await authClient.get("/me", { headers });
        return response.data;
    },

    startGoogleAuth: async (state?: string) => {
        const params = state ? { state } : {};
        const response = await authClient.get("/google/start", { params });
        return response.data;
    },

    callbackGoogleAuth: async (
        code: string,
        state?: string,
        error?: string,
    ) => {
        const params = { code, state, error };
        const response = await authClient.get("/google/callback", { params });
        return response.data;
    },

    updateSettings: async (settings: any) => {
        const headers = await getAuthHeaders();
        const response = await authClient.put("/users/time", settings, {
            headers,
        });
        return response.data;
    },

    updateUser: async (userData: any) => {
        const headers = await getAuthHeaders();
        const response = await authClient.put("/users", userData, {
            headers,
        });
        return response.data;
    },
};

export const category = {
    getHello: async () => {
        const response = await categoryClient.get("/");
        return response.data;
    },
};

export const areas = {
    getAreasByUser: async () => {
        const headers = await getAuthHeaders();
        const response = await categoryClient.get("/areas", { headers });
        return response.data;
    },

    createArea: async (data: { name: string; color?: string }) => {
        const headers = await getAuthHeaders();
        const response = await categoryClient.post("/areas", data, { headers });
        return response.data;
    },

    updateArea: async (id: string, data: any) => {
        const headers = await getAuthHeaders();
        const response = await categoryClient.put(`/areas/${id}`, data, {
            headers,
        });
        return response.data;
    },

    deleteArea: async (id: string) => {
        const headers = await getAuthHeaders();
        const response = await categoryClient.delete(`/areas/${id}`, {
            headers,
        });
        return response.data;
    },
};

export const subareas = {
    getSubareaByArea: async (areaId: string) => {
        const headers = await getAuthHeaders();
        const response = await categoryClient.get(`/subareas/${areaId}`, {
            headers,
        });
        return response.data;
    },

    createSubarea: async (data: any) => {
        const headers = await getAuthHeaders();
        const response = await categoryClient.post("/subareas", data, {
            headers,
        });
        return response.data;
    },

    updateSubarea: async (id: string, data: any) => {
        const headers = await getAuthHeaders();
        const response = await categoryClient.put(`/subareas/${id}`, data, {
            headers,
        });
        return response.data;
    },

    deleteSubarea: async (id: string) => {
        const headers = await getAuthHeaders();
        const response = await categoryClient.delete(`/subareas/${id}`, {
            headers,
        });
        return response.data;
    },
};

export const plannedSession = {
    getPlan: async () => {
        const headers = await getAuthHeaders();
        const response = await plannedSessionClient.get("/planned-sessions", {
            headers,
        });
        return response.data;
    },

    updatePlan: async (sessions: any[]) => {
        const headers = await getAuthHeaders();
        const response = await plannedSessionClient.post(
            "/planned-sessions",
            { sessions },
            { headers },
        );
        return response.data;
    },

    deletePlan: async () => {
        const headers = await getAuthHeaders();
        const response = await plannedSessionClient.delete(
            "/planned-sessions",
            {
                headers,
            },
        );
        return response.data;
    },
};

export const apiClient = {
    auth: auth,
    category: category,
    areas: areas,
    subareas: subareas,
    plannedSession: plannedSession,
};
