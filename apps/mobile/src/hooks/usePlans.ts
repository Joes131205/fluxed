import { useQuery } from "@tanstack/react-query";
import { plansClient } from "../lib/client";

export const usePlans = () => {
    return useQuery({
        queryKey: ["plan"],
        queryFn: async () => {
            const response = await plansClient.getPlan();
            return response;
        },
    });
};
