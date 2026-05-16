import { Pressable, Text, View } from "react-native";
import { PrimaryButton } from "../ui/PrimaryButton";

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
            <View className="border-b-2 border-dashed border-white/30 pb-4 mb-2">
                <Text
                    className="text-xl text-white uppercase"
                    style={{ fontFamily: "PressStart2P_400Regular" }}
                >
                    Proposed Timeline
                </Text>
            </View>
            {finalSchedule.length > 0 ? (
                <View className="mb-10 mt-4">
                    <View className="flex flex-col gap-3">
                        {finalSchedule.map((slot, idx) => (
                            <View key={`${slot.subareaId}-${idx}`}>
                                <View className="flex-row items-center justify-between border-2 border-dashed border-white/30 bg-black p-5">
                                    <View className="flex-1 pr-4">
                                        <Text className="mb-2 text-[10px] font-black uppercase tracking-widest text-white/50">
                                            {slot.area}
                                        </Text>
                                        <Text
                                            className="text-sm leading-6 text-white"
                                            style={{
                                                fontFamily:
                                                    "PressStart2P_400Regular",
                                            }}
                                            numberOfLines={2}
                                        >
                                            {slot.subarea}
                                        </Text>
                                    </View>

                                    <View className="border-l-2 border-white/10 pl-4 items-end">
                                        <Text className="font-mono text-sm font-black text-white">
                                            {formatTime(slot.start)}
                                        </Text>
                                        <Text className="mt-1 font-mono text-xs font-bold text-white/50">
                                            {formatTime(slot.end)}
                                        </Text>
                                    </View>
                                </View>
                                {idx !== finalSchedule.length - 1 ? (
                                    <Text className="text-center w-full mt-3 text-white/30">
                                        |
                                    </Text>
                                ) : (
                                    ""
                                )}
                            </View>
                        ))}
                    </View>

                    <View className="mt-6">
                        <PrimaryButton
                            onPress={onSaveToDatabase}
                            label={isLoading ? "Processing..." : "Confirm Plan"}
                            loading={isLoading}
                        />
                    </View>
                </View>
            ) : isGeneratedOnce ? (
                <View className="border-2 border-dashed border-white/20 p-5 mt-4">
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
                <View className="border-2 border-dashed border-white/20 p-5 mt-4">
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
