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
                        color: area.color,
                        subareas: (subareaData.data || []).map(
                            (subarea: any) => ({
                                subareaId: subarea.id,
                                subareaName: subarea.name,
                                weight: subarea.weight || 1,
                                color: subarea.color,
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
                {areas.length > 0 ? (
                    areas.map((a) => <AreaSection key={a.areaId} area={a} />)
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
