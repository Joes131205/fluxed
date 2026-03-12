import { getAuthHeaders } from "@/lib/authHeaders";
import { subareasClient } from "@/lib/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useSubareas = (areaId: string) => {
    return useQuery({
        queryKey: ["subareas"],
        queryFn: async () => {
            const response = await subareasClient[":id"].$get(
                {
                    param: { id: areaId },
                },
                {
                    headers: getAuthHeaders(),
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
            const response = await subareasClient.$post(
                { json: newSubarea },
                {
                    headers: getAuthHeaders(),
                },
            );
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["subareas"],
            });
        },
    });
};

export const useEditSubarea = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string, subarea: any) => {
            const response = await subareasClient[":id"].$put(
                {
                    json: subarea,
                    param: { id },
                },
                {
                    headers: getAuthHeaders(),
                },
            );
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["subareas"],
            });
        },
    });
};
