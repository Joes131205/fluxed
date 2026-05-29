import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthHeaders } from "../lib/authHeaders";
import { subareasClient, areasClient } from "../lib/client";

export const useSubareas = (areaId: string) => {
    return useQuery({
        queryKey: ["subareas", areaId],
        queryFn: async () => {
            const headers = await getAuthHeaders();
            const response = await subareasClient[":id"].$get(
                {
                    param: { id: areaId },
                },
                {
                    headers,
                },
            );

            return response.json();
        },
        enabled: !!areaId,
    });
};

export const useAllSubareas = () => {
    return useQuery({
        queryKey: ["subareas"],
        queryFn: async () => {
            const headers = await getAuthHeaders();
            const areasResponse = await (areasClient as any).$get(
                {},
                { headers },
            );
            const areasJson = areasResponse ? await areasResponse.json() : null;
            const areasList = areasJson?.ok ? (areasJson.data as any[]) : [];

            const allSubareas: any[] = [];

            for (const a of areasList) {
                try {
                    const r = await subareasClient[":id"].$get(
                        { param: { id: a.id } },
                        { headers },
                    );
                    const j = await r.json();
                    if (j?.ok && Array.isArray(j.data)) {
                        allSubareas.push(
                            ...j.data.map((s: any) => ({
                                ...s,
                                area_id: a.id,
                                areaName: a.name,
                            })),
                        );
                    }
                } catch (err) {}
            }

            return { ok: true, data: allSubareas };
        },
    });
};

export const useCreateSubarea = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newSubarea: any) => {
            const headers = await getAuthHeaders();
            const response = await subareasClient.$post(
                { json: newSubarea },
                {
                    headers,
                },
            );

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["subareas"],
            });
        },
    });
};

export const useUpdateSubarea = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, subarea }: { id: string; subarea: any }) => {
            const headers = await getAuthHeaders();
            const response = await subareasClient[":id"].$put(
                { param: { id }, json: subarea },
                { headers },
            );

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subareas"] });
        },
    });
};

export const useDeleteSubarea = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const headers = await getAuthHeaders();
            const response = await subareasClient[":id"].$delete(
                { param: { id } },
                { headers },
            );

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subareas"] });
        },
    });
};
