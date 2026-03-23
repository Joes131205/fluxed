import { getAuthHeaders } from "@/lib/authHeaders";
import { plansClient } from "@/lib/client";
import { useQuery } from "@tanstack/react-query";

export const useSubareas = () => {
    return useQuery({
        queryKey: ["plan"],
        queryFn: async () => {
            const response = await plansClient.$get(
                {},
                {
                    headers: getAuthHeaders(),
                },
            );
            return response.json();
        },
    });
};
