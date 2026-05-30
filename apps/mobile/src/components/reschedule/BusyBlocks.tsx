import { Pressable, Text, View } from "react-native";
import { TextPrimaryInput } from "../ui/TextPrimaryInput";
import { PrimaryButton } from "../ui/PrimaryButton";

export function BusyBlocks({
    isGoogleConnected,
    isLoading,
    start,
    end,
    onStartChange,
    onEndChange,
    onAddEvent,
    onSyncCalendar,
    calendar,
    onRemoveEvent,
    formatTime,
}: any) {
    return (
        <View className="flex flex-col mt-2">
            <Text className="text-[10px] font-black text-primary uppercase tracking-widest mb-3">
                Busy Blocks
            </Text>

            {isGoogleConnected ? (
                <View className="border border-white/20 p-4 mb-4">
                    <Text className="text-white/70 font-mono uppercase mb-4 text-xs">
                        Google Calendar Linked
                    </Text>
                    <PrimaryButton
                        label="Fetch Data"
                        onPress={onSyncCalendar}
                        loading={isLoading}
                    />
                </View>
            ) : (
                <View className="flex flex-col mb-4">
                    <View className="flex-row items-center gap-3">
                        <View className="flex-1">
                            <TextPrimaryInput
                                label="Start"
                                value={start}
                                onChangeText={onStartChange}
                                placeholder="HH:MM"
                            />
                        </View>
                        <Text className="text-primary font-mono text-lg mb-4">
                            ▷
                        </Text>
                        <View className="flex-1">
                            <TextPrimaryInput
                                label="End"
                                value={end}
                                onChangeText={onEndChange}
                                placeholder="HH:MM"
                            />
                        </View>
                    </View>
                    <PrimaryButton label="Add Block" onPress={onAddEvent} />
                </View>
            )}

            {calendar.length > 0 && (
                <View className="flex flex-col gap-2 mt-2">
                    {calendar.map((item: any) => (
                        <View key={item.id} className="flex flex-col">
                            {item.busy.length > 0 &&
                                item.busy.map((slot: any, index: number) => (
                                    <View
                                        key={`${item.id}-${index}`}
                                        className="flex-row items-center justify-between border-b border-white/10 py-2"
                                    >
                                        <View className="flex-row items-center gap-2">
                                            <Text className="text-[10px] font-black uppercase tracking-widest text-primary">
                                                [{item.name}]
                                            </Text>
                                            <Text className="text-white font-mono text-xs">
                                                {formatTime(slot.start)}{" "}
                                                <Text className="text-white/30">
                                                    {"->"}
                                                </Text>{" "}
                                                {formatTime(slot.end)}
                                            </Text>
                                        </View>

                                        {!isGoogleConnected && (
                                            <Pressable
                                                onPress={() =>
                                                    onRemoveEvent(index)
                                                }
                                                className="border border-white/20 px-2 py-1"
                                            >
                                                <Text className="font-mono text-xs font-bold text-white/50">
                                                    X
                                                </Text>
                                            </Pressable>
                                        )}
                                    </View>
                                ))}
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}
