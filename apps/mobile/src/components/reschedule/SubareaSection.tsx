import { Text, View, Pressable } from "react-native";

type SubareaItem = {
    color?: string;
    subareaId: string;
    subareaName: string;
    description?: string;
    weight: number;
    isExcluded: boolean;
};

type SubareaSectionProps = {
    areaId: string;
    subareas: SubareaItem[];
    onToggleSubareaExclude: (areaId: string, subareaId: string) => void;
};

export const SubareaSection = ({
    subareas,
    areaId,
    onToggleSubareaExclude,
}: SubareaSectionProps) => {
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
                        className="border border-white/20 px-3 py-2 min-w-30"
                    >
                        <View className="flex flex-col gap-3">
                            <Text className="text-xs font-mono text-white/80">
                                {subarea.subareaName}
                            </Text>
                            {subarea.description ? (
                                <Text
                                    className="text-gray-400 text-xs mt-1 ml-5"
                                    numberOfLines={2}
                                >
                                    {subarea.description}
                                </Text>
                            ) : null}

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
                                <Pressable
                                    onPress={() =>
                                        onToggleSubareaExclude(
                                            areaId,
                                            subarea.subareaId,
                                        )
                                    }
                                    className="px-1.5 py-0.5 border border-white/20 active:bg-white/10 ml-2"
                                >
                                    <Text
                                        className={`font-mono text-[10px] ${subarea.isExcluded ? "text-red-500" : "text-[#00b32d]"}`}
                                    >
                                        {subarea.isExcluded
                                            ? "[X] EXC"
                                            : "[O] INC"}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                );
            })}
        </View>
    );
};
