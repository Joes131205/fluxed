import React, { useEffect, useState } from "react";
import { subareasClient } from "../../lib/client";
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

        if (areasData.length === 0) {
            setAreas([]);
            setIsSubareasLoading(false);
            return;
        }

        let isMounted = true;

        const fetchSubareas = async () => {
            setIsSubareasLoading(true);
            try {
                const transformedData = await Promise.all(
                    areasData.map(async (area: any) => {
                        const subareaData =
                            await subareasClient.getSubareaByArea(area.id);

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
        <View className="flex flex-col gap-4 mt-2">
            <View className="border-b-2 border-dashed border-white/30 pb-4 mb-2">
                <Text
                    className="text-xl text-white uppercase"
                    style={{ fontFamily: "PressStart2P_400Regular" }}
                >
                    Areas
                </Text>
            </View>

            <View className="flex flex-col gap-4">
                {areas.length > 0 ? (
                    areas.map((a) => <AreaSection key={a.areaId} area={a} />)
                ) : shouldShowLoading ? (
                    <View className="border-2 border-white/20 p-5 border-dashed">
                        <Text className="font-mono text-white/70 uppercase text-xs">
                            Fetching...
                        </Text>
                    </View>
                ) : (
                    <View className="border-2 border-white/20 p-5 border-dashed">
                        <Text className="font-mono text-white/50 uppercase text-xs mb-4">
                            No Areas!
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};
