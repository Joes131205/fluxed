import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { areasClient } from "../lib/client";

export const useAreas = () => {
    return useQuery({
        queryKey: ["areas"],
        queryFn: async () => {
            const response = await areasClient.getAreasByUser();
            return response &&
                typeof response === "object" &&
                "data" in response
                ? (response as any).data
                : response;
        },
    });
};

export const useCreateArea = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newArea: any) => {
            const response = await areasClient.createArea(newArea);
            return response &&
                typeof response === "object" &&
                "data" in response
                ? (response as any).data
                : response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["areas"],
            });
        },
    });
};
