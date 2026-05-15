import { Text, View } from "react-native";

type SubareaItem = {
    color?: string;
    subareaId: string;
    subareaName: string;
    weight: number;
};

type SubareaSectionProps = {
    subareas: SubareaItem[];
};

export const SubareaSection = ({ subareas }: SubareaSectionProps) => {
    if (!subareas.length) {
        return (
            <View className="mt-4 pt-4 border-t-2 border-dashed border-white/10">
                <Text className="text-xs font-mono text-white/40 uppercase">
                    No Subareas!
                </Text>
            </View>
        );
    }

    return (
        <View className="mt-4 pt-4 border-t-2 border-dashed border-white/10 flex flex-row flex-wrap gap-3">
            {subareas.map((subarea) => {
                const color = subarea.color ?? "rgba(255,255,255,0.5)";

                return (
                    <View
                        key={subarea.subareaId}
                        className="border border-white/20 px-3 py-2 min-w-[120px]"
                    >
                        <View className="flex flex-col gap-3">
                            <Text className="text-xs font-mono text-white/80">
                                {subarea.subareaName}
                            </Text>

                            <View className="flex flex-row gap-1">
                                {[...new Array(5)].map((_, i) => {
                                    const isActive = i < subarea.weight;
                                    return (
                                        <View
                                            key={`${subarea.subareaId}-${i}`}
                                            className={`h-2 w-2 border ${isActive ? "border-transparent" : "border-white/20"}`}
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
                    </View>
                );
            })}
        </View>
    );
};
