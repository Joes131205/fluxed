import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthHeaders } from "../lib/authHeaders";
import { actionsClient } from "../lib/client";

export const useCreateAction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { subarea_id: string; title: string }) => {
            const response = await actionsClient.$post(
                { json: data },
                { headers: await getAuthHeaders() },
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    (errorData as any).error || "Failed to create action",
                );
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subareas"] });
            queryClient.invalidateQueries({ queryKey: ["areas"] });
            queryClient.invalidateQueries({ queryKey: ["actions"] });
        },
    });
};
export const useAllActions = (subareaId: string | null) => {
    return useQuery({
        queryKey: ["actions", subareaId],
        enabled: !!subareaId,
        queryFn: async () => {
            if (!subareaId) return { ok: false, data: [] };

            const headers = await getAuthHeaders();
            const response = await actionsClient[":subareaId"].$get(
                { param: { subareaId: subareaId } },
                { headers },
            );
            return response.json();
        },
    });
};

export const useUpdateAction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: {
            id: string;
            title?: string;
            isCompleted?: boolean;
        }) => {
            const { id, ...updates } = data;

            const response = await actionsClient[":id"].$patch(
                {
                    param: { id },
                    json: updates,
                },
                { headers: await getAuthHeaders() },
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    (errorData as any).error || "Failed to update action",
                );
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subareas"] });
            queryClient.invalidateQueries({ queryKey: ["areas"] });
            queryClient.invalidateQueries({ queryKey: ["actions"] });
        },
    });
};

export const useDeleteAction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await actionsClient[":id"].$delete(
                { param: { id } },
                { headers: await getAuthHeaders() },
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    (errorData as any).error || "Failed to delete action",
                );
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subareas"] });
            queryClient.invalidateQueries({ queryKey: ["areas"] });
            queryClient.invalidateQueries({ queryKey: ["actions"] });
        },
    });
};
