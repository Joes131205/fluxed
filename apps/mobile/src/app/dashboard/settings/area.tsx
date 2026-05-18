import React from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { useAreas } from "../../../hooks/useAreas";

export default function AreaSetting() {
    const { data: areasData, isLoading: isAreaLoading } = useAreas();

    if (isAreaLoading) {
        return (
            <View className="flex flex-1 items-center justify-center">
                <Text className="text-2xl font-bold">Loading areas...</Text>
            </View>
        );
    }

    const areas = areasData?.ok ? (areasData.data as any[]) : [];

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName=" flex flex-col gap-5 py-10 px-4"
        >
            <View className="flex flex-col pb-6 mb-6 border-b-2 border-dashed border-white/30">
                <Text
                    className="text-2xl text-white uppercase"
                    style={{ fontFamily: "PressStart2P_400Regular" }}
                >
                    Area Settings
                </Text>
            </View>

            {areas.length === 0 ? (
                <View className="rounded-2xl bg-card p-5 text-center">
                    <Text className="text-lg font-bold">No areas yet</Text>
                    <Text className="text-sm text-muted-foreground mt-2">
                        Create an area first before continuing will ya?
                    </Text>
                </View>
            ) : (
                <View className="flex flex-col gap-3">
                    {areas.map((area: any) => (
                        <View
                            key={area.id}
                            className="flex-row items-center justify-between bg-white rounded-lg p-4"
                        >
                            <View className="flex-row items-center gap-3">
                                <View
                                    className="w-8 h-8 rounded"
                                    style={{
                                        backgroundColor:
                                            area.color || "#6b7280",
                                    }}
                                />
                                <View>
                                    <Text className="text-lg font-semibold">
                                        {area.name}
                                    </Text>
                                    <Text className="text-sm text-muted-foreground">
                                        Weight: {area.weight ?? 1}
                                    </Text>
                                </View>
                            </View>

                            <Pressable className="px-3 py-2 rounded bg-primary">
                                <Text className="text-white font-semibold">
                                    Edit
                                </Text>
                            </Pressable>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}
