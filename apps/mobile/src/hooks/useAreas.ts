import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { areasClient } from "../lib/client";
import { getAuthHeaders } from "../lib/authHeaders";

export const useAreas = () => {
    return useQuery({
        queryKey: ["areas"],
        queryFn: async () => {
            const headers = await getAuthHeaders();
            const response = await areasClient.$get(
                {},
                {
                    headers,
                },
            );

            return response.json();
        },
    });
};

export const useCreateArea = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newArea: any) => {
            const headers = await getAuthHeaders();
            const response = await areasClient.$post(
                { json: newArea },
                {
                    headers,
                },
            );
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["areas"],
            });
        },
    });
};

export const useUpdateArea = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, area }: { id: string; area: any }) => {
            const headers = await getAuthHeaders();
            const response = await areasClient[":id"].$put(
                { param: { id }, json: area },
                { headers },
            );

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["areas"] });
        },
    });
};

export const useDeleteArea = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const headers = await getAuthHeaders();
            const response = await areasClient[":id"].$delete(
                { param: { id } },
                { headers },
            );

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["areas"] });
        },
    });
};
