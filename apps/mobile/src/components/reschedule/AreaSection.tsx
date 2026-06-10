import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SubareaSection } from "./SubareaSection";

export type AreaSectionItem = {
    color?: string;
    areaId: string;
    areaName: string;
    description?: string;
    weight: number;
    isExcluded: boolean;
    subareas: {
        color?: string;
        subareaId: string;
        subareaName: string;
        description?: string;
        weight: number;
        isExcluded: boolean;
    }[];
};

type AreaSectionProps = {
    area: AreaSectionItem;
    onToggleExclude: (areaId: string) => void;
    onToggleSubareaExclude: (areaId: string, subareaId: string) => void;
};

export const AreaSection = ({
    area,
    onToggleExclude,
    onToggleSubareaExclude,
}: AreaSectionProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const color = area.color ?? "rgba(255,255,255,0.5)";

    return (
        <View className="border-2 border-primary/30 bg-background p-4 w-full mb-1 flex flex-col gap-5">
            <Pressable
                onPress={() => setIsExpanded((prev) => !prev)}
                className="flex flex-row items-center justify-between w-full"
            >
                <View className="flex flex-row items-center flex-1 pr-4">
                    <Text className="text-muted-foreground font-mono text-sm mr-3">
                        {isExpanded ? "[-]" : "[+]"}
                    </Text>
                    <Text
                        className={`text-sm font-black uppercase tracking-widest ${isExpanded ? "text-foreground" : "text-muted-foreground"}`}
                        numberOfLines={1}
                    >
                        {area.areaName}
                    </Text>
                    {area.description ? (
                        <Text
                            className="text-muted-foreground text-xs mt-1 ml-5"
                            numberOfLines={2}
                        >
                            {area.description}
                        </Text>
                    ) : null}
                </View>

                <View className="flex flex-row items-center gap-3">
                    <View className="flex flex-row gap-1">
                        {[...new Array(5)].map((_, i) => {
                            const isActive = i < area.weight;
                            return (
                                <View
                                    key={`${area.areaId}-${i}`}
                                    className={`h-3 w-3 border ${isActive ? "border-transparent" : "border-primary/20"}`}
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
            <Pressable
                onPress={(e) => {
                    e.stopPropagation();
                    onToggleExclude(area.areaId);
                }}
                className="px-2 py-2 border border-primary/20 active:bg-primary/10"
            >
                <Text
                    className={`font-mono text-xs ${area.isExcluded ? "text-destructive" : "text-primary"}`}
                >
                    {area.isExcluded ? "Excluded" : "Included"}
                </Text>
            </Pressable>
            {isExpanded ? (
                <SubareaSection
                    areaId={area.areaId}
                    subareas={area.subareas}
                    onToggleSubareaExclude={onToggleSubareaExclude}
                />
            ) : null}
        </View>
    );
};
