import { getAuthHeaders } from "@/lib/authHeaders";
import { subareasClient } from "@/lib/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
