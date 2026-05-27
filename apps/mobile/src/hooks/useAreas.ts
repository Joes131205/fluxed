import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { areasClient } from "../lib/client";

export const useAreas = () => {
    return useQuery({
        queryKey: ["areas"],
        queryFn: async () => {
            const response = await areasClient.getAreasByUser();
            return response.data;
        },
    });
};

export const useCreateArea = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newArea: any) => {
            const response = await areasClient.createArea(newArea);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["areas"],
            });
        },
    });
};
