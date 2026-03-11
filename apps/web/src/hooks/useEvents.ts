import { getAuthHeaders } from "@/lib/authHeaders";
import { eventsClient } from "@/lib/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
