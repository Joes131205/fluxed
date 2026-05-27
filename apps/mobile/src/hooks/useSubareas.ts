import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { subareasClient } from "../lib/client";

export const useSubareas = (areaId: string) => {
    return useQuery({
        queryKey: ["subareas", areaId],
        queryFn: async () => {
            const response = await subareasClient.getSubareaByArea(areaId);
            return response.data;
        },
        enabled: !!areaId,
    });
};

export const useAllSubareas = () => {
    return useQuery({
        queryKey: ["subareas"],
        queryFn: async () => {
            const response = await subareasClient.getSubareaByArea("");
            return response.data;
        },
    });
};

export const useCreateSubarea = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newSubarea: any) => {
            const response = await subareasClient.createSubarea(newSubarea);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["subareas"],
            });
        },
    });
};
