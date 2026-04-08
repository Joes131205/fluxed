import { useQuery } from "@tanstack/react-query";
import { plansClient } from "../lib/client";
import { getAuthHeaders } from "../lib/authHeaders";

export const usePlans = () => {
    return useQuery({
        queryKey: ["plan"],
        queryFn: async () => {
            const headers = await getAuthHeaders();
            const response = await plansClient.$get(
                {},
                {
                    headers,
                },
            );
            return response.json();
        },
    });
};
