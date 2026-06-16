import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthHeaders } from "../lib/authHeaders";
import type { ScheduleInput } from "../../../packages/shared/src/inputs";
import { schedulesClient } from "../lib/client";

export const useSchedules = () => {
    return useQuery({
        queryKey: ["schedules"],
        queryFn: async () => {
            const headers = await getAuthHeaders();
            const response = await schedulesClient.$get(undefined, { headers });

            if (!response.ok) {
                throw new Error("Failed to fetch schedules");
            }
            return response.json();
        },
    });
};

export const useCreateSchedule = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ScheduleInput) => {
            const response = await schedulesClient.$post(
                { json: data },
                { headers: await getAuthHeaders() },
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    (errorData as any).error || "Failed to create schedule",
                );
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
        },
    });
};

export const useUpdateSchedule = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string } & ScheduleInput) => {
            const { id, ...updates } = data;

            const response = await schedulesClient[":id"].$patch(
                {
                    param: { id },
                    json: updates,
                },
                { headers: await getAuthHeaders() },
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    (errorData as any).error || "Failed to update schedule",
                );
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
        },
    });
};

export const useDeleteSchedule = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await schedulesClient[":id"].$delete(
                { param: { id } },
                { headers: await getAuthHeaders() },
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    (errorData as any).error || "Failed to delete schedule",
                );
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
        },
    });
};
