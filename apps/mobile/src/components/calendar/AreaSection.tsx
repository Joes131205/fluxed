import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SubareaSection } from "./SubareaSection";

export type AreaSectionItem = {
    color?: string;
    areaId: string;
    areaName: string;
    weight: number;
    subareas: {
        color?: string;
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
    const color = area.color ?? "rgba(255,255,255,0.5)";

    return (
        <View className="border-2 border-white/30 bg-black p-4 w-full mb-1">
            <Pressable
                onPress={() => setIsExpanded((prev) => !prev)}
                className="flex flex-row items-center justify-between w-full"
            >
                <View className="flex flex-row items-center flex-1 pr-4">
                    <Text className="text-white/50 font-mono text-sm mr-3">
                        {isExpanded ? "[-]" : "[+]"}
                    </Text>
                    <Text
                        className={`text-sm font-black uppercase tracking-widest ${isExpanded ? "text-white" : "text-white/70"}`}
                        numberOfLines={1}
                    >
                        {area.areaName}
                    </Text>
                </View>

                <View className="flex flex-row items-center gap-3">
                    <View className="flex flex-row gap-1">
                        {[...new Array(5)].map((_, i) => {
                            const isActive = i < area.weight;
                            return (
                                <View
                                    key={`${area.areaId}-${i}`}
                                    className={`h-3 w-3 border ${isActive ? "border-transparent" : "border-white/20"}`}
                                    style={{
                                        backgroundColor: isActive
                                            ? color
                                            : "transparent",
                                    }}
                                />
                            );
                        })}
                    </View>
                </View>
            </Pressable>

            {isExpanded ? <SubareaSection subareas={area.subareas} /> : null}
        </View>
    );
};
