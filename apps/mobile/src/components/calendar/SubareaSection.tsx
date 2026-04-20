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
            <Text className="text-sm text-muted-foreground">
                No subareas yet.
            </Text>
        );
    }
    console.log(subareas);
    return (
        <View className="mt-3 flex flex-row flex-wrap gap-2">
            {subareas.map((subarea) => (
                <View
                    key={subarea.subareaId}
                    className="rounded-md border border-border bg-card px-3 py-2"
                >
                    {(() => {
                        const color = subarea.color;
                        return (
                            <View className="flex flex-col gap-2 items-center justify-between">
                                <Text className="text-sm font-semibold">
                                    {subarea.subareaName}
                                </Text>
                                <View className="flex flex-row gap-1">
                                    {[...new Array(5)].map((_, i) => (
                                        <View
                                            key={`${subarea.subareaId}-${i}`}
                                            className="h-2 w-2"
                                            style={{
                                                backgroundColor:
                                                    i < subarea.weight
                                                        ? color
                                                        : "#6b7280",
                                            }}
                                        />
                                    ))}
                                </View>
                            </View>
                        );
                    })()}
                </View>
            ))}
        </View>
    );
};
