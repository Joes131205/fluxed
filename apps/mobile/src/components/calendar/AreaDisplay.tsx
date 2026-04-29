import React, { useEffect, useState } from "react";
import { subareasClient } from "../../lib/client";
import { getAuthHeaders } from "../../lib/authHeaders";
import { useAreas } from "../../hooks/useAreas";
import { Text, View } from "react-native";
import { AreaSection, type AreaSectionItem } from "./AreaSection";

type AreaDisplayProps = {
    areasDataOverride?: AreaSectionItem[];
    isLoadingOverride?: boolean;
};

export const AreaDisplay = ({
    areasDataOverride,
    isLoadingOverride,
}: AreaDisplayProps) => {
    const { data: areasData, isLoading: isAreaLoading } = useAreas();
    const [areas, setAreas] = useState<AreaSectionItem[]>([]);
    const [isSubareasLoading, setIsSubareasLoading] = useState(false);

    useEffect(() => {
        if (areasDataOverride !== undefined) {
            setAreas(areasDataOverride);
            return;
        }

        if (!areasData?.ok || !areasData.data) {
            setAreas([]);
            setIsSubareasLoading(false);
            return;
        }

        let isMounted = true;

        const fetchSubareas = async () => {
            setIsSubareasLoading(true);
            try {
                const headers = await getAuthHeaders();
                const transformedData = await Promise.all(
                    areasData.data.map(async (area: any) => {
                        const response = await subareasClient[":id"].$get(
                            {
                                param: { id: area.id },
                            },
                            {
                                headers,
                            },
                        );
                        const subareaData: any = await response.json();

                        return {
                            areaId: area.id,
                            areaName: area.name,
                            color: area.color,
                            subareas: (subareaData.data || []).map(
                                (subarea: any) => ({
                                    subareaId: subarea.id,
                                    subareaName: subarea.name,
                                    weight: subarea.weight || 1,
                                    color: subarea.color,
                                }),
                            ),
                            weight: area.weight || 1,
                        };
                    }),
                );

                if (isMounted) {
                    setAreas(transformedData);
                }
            } finally {
                if (isMounted) {
                    setIsSubareasLoading(false);
                }
            }
        };

        void fetchSubareas();

        return () => {
            isMounted = false;
        };
    }, [areasData, areasDataOverride]);

    const shouldShowLoading =
        isLoadingOverride ?? (isAreaLoading || isSubareasLoading);

    return (
        <View className="flex flex-col gap-3">
            <Text className="text-xl font-bold">Your areas</Text>
            <View className="flex flex-col gap-3">
                {areas.length > 0 ? (
                    areas.map((a) => <AreaSection key={a.areaId} area={a} />)
                ) : shouldShowLoading ? (
                    <View className="rounded-2xl bg-card p-5 text-center flex flex-col gap-2">
                        <Text className="mt-2 text-2xl font-bold text-foreground text-center">
                            Loading areas...
                        </Text>
                    </View>
                ) : (
                    <View className="rounded-2xl bg-card p-5 text-center flex flex-col gap-2">
                        <Text className="mt-2 text-2xl font-bold text-foreground text-center">
                            No areas and subareas listed!
                        </Text>
                        <Text className="mt-2 text-sm font-bold text-foreground text-center">
                            Tip: To actually generate a timeline, make sure you
                            have subarea listed too!
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};
