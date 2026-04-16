import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SubareaSection } from "./SubareaSection";

export type AreaSectionItem = {
    areaId: string;
    areaName: string;
    weight: number;
    subareas: {
        subareaId: string;
        subareaName: string;
        weight: number;
    }[];
};

type AreaSectionProps = {
    area: AreaSectionItem;
};

export const AreaSection = ({ area }: AreaSectionProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <View className="p-5 bg-white rounded-md w-full">
            <Pressable
                onPress={() => setIsExpanded((prev) => !prev)}
                className="flex flex-row items-center justify-between w-full"
            >
                <Text className="text-lg font-bold">{area.areaName}</Text>
                <View className="flex flex-row items-center gap-3">
                    <View className="flex flex-row gap-1">
                        {[...new Array(5)].map((_, i) => (
                            <View
                                key={`${area.areaId}-${i}`}
                                className={
                                    i < area.weight
                                        ? "bg-primary h-2 w-2"
                                        : "bg-gray-500 h-2 w-2"
                                }
                            />
                        ))}
                    </View>
                    <Text className="text-base font-semibold text-muted-foreground">
                        {isExpanded ? "▲" : "▼"}
                    </Text>
                </View>
            </Pressable>
            {isExpanded ? <SubareaSection subareas={area.subareas} /> : null}
        </View>
    );
};
