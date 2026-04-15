import { Pressable, Text, View } from "react-native";

type OutputTimelineProps = {
    finalSchedule: Array<{
        subareaId: string;
        area: string;
        subarea: string;
        start: string;
        end: string;
    }>;
    isGeneratedOnce: boolean;
    isLoading: boolean;
    onSaveToDatabase: () => void;
    formatTime: (isoDate: string) => string;
};

export function OutputTimeline({
    finalSchedule,
    isGeneratedOnce,
    isLoading,
    onSaveToDatabase,
    formatTime,
}: OutputTimelineProps) {
    return (
        <View className="flex flex-col gap-3">
            <Text className="text-xl font-bold">Output Timeline</Text>
            {finalSchedule.length > 0 ? (
                <View>
                    <View className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
                        {finalSchedule.map((slot, index) => (
                            <View
                                key={`${slot.subareaId}-${index}`}
                                className="rounded-md border border-border bg-white p-3"
                            >
                                <View className="flex flex-row items-center gap-5">
                                    <View className="flex flex-col gap-1">
                                        <Text className="text-xs font-black uppercase tracking-widest text-text/30">
                                            Area
                                        </Text>
                                        <Text className="text-lg font-black tracking-tight text-text mb-4">
                                            {slot.area}
                                        </Text>
                                    </View>

                                    <View className="flex flex-col gap-1">
                                        <Text className="text-xs font-black uppercase tracking-widest text-text/30">
                                            Subarea
                                        </Text>
                                        <Text className="text-lg font-black tracking-tight text-text mb-4">
                                            {slot.subarea}
                                        </Text>
                                    </View>
                                </View>
                                <Text className="text-md">
                                    {formatTime(slot.start)} -{" "}
                                    {formatTime(slot.end)}
                                </Text>
                            </View>
                        ))}

                        <Pressable
                            onPress={onSaveToDatabase}
                            className="w-full rounded-md bg-primary px-4 py-3"
                        >
                            <Text className="text-center font-semibold text-white">
                                {isLoading ? "Saving..." : "Save to Database"}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            ) : isGeneratedOnce ? (
                <View className="rounded-2xl bg-card p-5 text-center flex flex-col gap-2">
                    <Text className="mt-2 text-2xl font-bold text-foreground text-center">
                        Wowzers 💀
                    </Text>
                    <Text className="mt-2 text-2xl font-bold text-foreground text-center">
                        Nothing generated
                    </Text>
                    <Text className="mt-2 text-base text-muted-foreground text-center">
                        No valid slots were available for your current
                        timeframe.
                    </Text>

                    <Text className="mt-1 text-sm text-muted-foreground text-center">
                        Maybe because the allocated events are too close to your
                        sleep window or you set the minimum task duration too
                        big or no areas and subareas?
                    </Text>
                </View>
            ) : (
                <View className="rounded-2xl bg-card p-5 text-center flex flex-col gap-2">
                    <Text className="mt-2 text-2xl font-bold text-foreground text-center">
                        Nothing yet!
                    </Text>
                    <Text className="mt-2 text-sm font-bold text-muted-foreground text-center">
                        Take your time, and reschedule it if needed!
                    </Text>
                </View>
            )}
        </View>
    );
}
