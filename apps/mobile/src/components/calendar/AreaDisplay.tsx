import React, { useEffect, useState } from "react";
import { subareasClient } from "../../lib/client";
import { getAuthHeaders } from "../../lib/authHeaders";
import { useAreas } from "../../hooks/useAreas";
import { Text, View } from "react-native";
import { AreaSection, type AreaSectionItem } from "./AreaSection";

type AreaDisplayProps = {
    areasDataOverride?: AreaSectionItem[];
};

export const AreaDisplay = ({ areasDataOverride }: AreaDisplayProps) => {
    const { data: areasData } = useAreas();
    const [areas, setAreas] = useState<AreaSectionItem[]>([]);
    useEffect(() => {
        if (areasDataOverride) {
            setAreas(areasDataOverride);
            return;
        }

        if (areasData?.ok && areasData.data) {
            Promise.all(
                areasData.data.map(async (area: any) => {
                    const response = await subareasClient[":id"].$get(
                        {
                            param: { id: area.id },
                        },
                        {
                            headers: getAuthHeaders,
                        },
                    );
                    const subareaData: any = await response.json();

                    return {
                        areaId: area.id,
                        areaName: area.name,
                        subareas: (subareaData.data || []).map(
                            (subarea: any) => ({
                                subareaId: subarea.id,
                                subareaName: subarea.name,
                                weight: subarea.weight || 1,
                            }),
                        ),
                        weight: area.weight,
                    };
                }),
            ).then((transformedData) => setAreas(transformedData));
        }
    }, [areasData, areasDataOverride]);

    return (
        <View className="flex flex-col gap-3">
            <Text className="text-xl font-bold">Your areas</Text>
            <View className="flex flex-col gap-3">
                {areas.map((a) => (
                    <AreaSection key={a.areaId} area={a} />
                ))}
            </View>
        </View>
    );
};
