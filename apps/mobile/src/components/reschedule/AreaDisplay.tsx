import React, { useEffect, useState } from "react";
import { subareasClient } from "../../lib/client";
import { getAuthHeaders } from "../../lib/authHeaders";
import { useAreas } from "../../hooks/useAreas";
import { Text, View } from "react-native";
import { AreaSection, type AreaSectionItem } from "./AreaSection";

type AreaDisplayProps = {
    areasDataOverride?: AreaSectionItem[];
    isLoadingOverride?: boolean;
    onToggleExclude: (areaId: string) => void;
    onToggleSubareaExclude: (areaId: string, subareaId: string) => void;
};

export const AreaDisplay = ({
    areasDataOverride,
    isLoadingOverride,
    onToggleExclude,
    onToggleSubareaExclude,
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
                            description: area.description,
                            color: area.color,
                            isExcluded: area.isExcluded,
                            subareas: (subareaData.data || []).map(
                                (subarea: any) => ({
                                    subareaId: subarea.id,
                                    subareaName: subarea.name,
                                    description: subarea.description,
                                    weight: subarea.weight || 1,
                                    color: subarea.color,
                                    isExcluded: subarea.isExcluded,
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
        <View className="flex flex-col border border-muted bg-card p-5 mt-2">
            <Text className="text-sm font-bold text-primary uppercase tracking-widest mb-4">
                Configured Areas
            </Text>

            <View className="flex flex-col gap-4">
                {areas.length > 0 ? (
                    areas.map((a) => (
                        <AreaSection
                            key={a.areaId}
                            area={a}
                            onToggleExclude={onToggleExclude}
                            onToggleSubareaExclude={onToggleSubareaExclude}
                        />
                    ))
                ) : shouldShowLoading ? (
                    <View className="border border-foreground/10 bg-background p-4">
                        <Text className="font-mono text-primary/70 uppercase text-xs text-center">
                            Fetching Data...
                        </Text>
                    </View>
                ) : (
                    <View className="border border-foreground/10 bg-background p-4">
                        <Text className="font-mono text-muted-foreground uppercase text-xs text-center">
                            No Areas Found
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};
