import { getAuthHeaders } from "@/lib/authHeaders";
import { eventsClient } from "@/lib/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useEvents = (subareaId: string) => {
    return useQuery({
        queryKey: ["areas"],
        queryFn: async () => {
            const response = await eventsClient[":id"].$get(
                {
                    param: { id: subareaId },
                },
                {
                    headers: getAuthHeaders(),
                },
            );
            return response.json();
        },
    });
};

export const useCreateEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newEvent: any) => {
            const response = await eventsClient.$post(
                { json: newEvent },
                {
                    headers: getAuthHeaders(),
                },
            );
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["events"],
            });
        },
    });
};
