import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthHeaders } from "../lib/authHeaders";
import { subareasClient } from "../lib/client";

export const useSubareas = (areaId: string) => {
    return useQuery({
        queryKey: ["subareas", areaId],
        queryFn: async () => {
            const headers = await getAuthHeaders();
            const response = await subareasClient[":id"].$get(
                {
                    param: { id: areaId },
                },
                {
                    headers,
                },
            );

            return response.json();
        },
        enabled: !!areaId,
    });
};

export const useAllSubareas = () => {
    return useQuery({
        queryKey: ["subareas"],
        queryFn: async () => {
            const headers = await getAuthHeaders();
            const response = await subareasClient.$get(
                {},
                {
                    headers,
                },
            );

            return response.json();
        },
    });
};

export const useCreateSubarea = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newSubarea: any) => {
            const headers = await getAuthHeaders();
            const response = await subareasClient.$post(
                { json: newSubarea },
                {
                    headers,
                },
            );

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["subareas"],
            });
        },
    });
};
