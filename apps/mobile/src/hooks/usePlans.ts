import { useQuery } from "@tanstack/react-query";
import { plansClient } from "../lib/client";
import { getAuthHeaders } from "../lib/authHeaders";

export const usePlans = () => {
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
