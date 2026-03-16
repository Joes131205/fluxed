import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { areasClient } from "@/lib/client";
import { getAuthHeaders } from "@/lib/authHeaders";

export const useAreas = () => {
    return useQuery({
        queryKey: ["areas"],
        queryFn: async () => {
            const response = await areasClient.$get(
                {},
                {
                    headers: getAuthHeaders(),
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
            console.log(newArea);
            const response = await areasClient.$post(
                { json: newArea },
                {
                    headers: getAuthHeaders(),
                },
            );
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["areas"],
            });
        },
    });
};
