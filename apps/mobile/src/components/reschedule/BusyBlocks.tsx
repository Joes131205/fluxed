import { Pressable, Text, View, TextInput } from "react-native";
import { TextPrimaryInput } from "../ui/TextPrimaryInput";
import { PrimaryButton } from "../ui/PrimaryButton";

type BusyBlocksProps = {
    isGoogleConnected: boolean;
    isLoading: boolean;
    start: string;
    end: string;
    onStartChange: (text: string) => void;
    onEndChange: (text: string) => void;
    onAddEvent: () => void;
    onSyncCalendar: () => void;
    calendar: Array<{
        id: string;
        name: string;
        busy: Array<{ start: string; end: string }>;
    }>;
    onRemoveEvent: (index: number) => void;
    formatTime: (isoDate: string) => string;
};

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
}: BusyBlocksProps) {
    return (
        <View className="flex flex-col gap-6 mt-4">
            <View className="border-b-2 border-dashed border-white/30 pb-4">
                <Text
                    className="text-xl text-white uppercase"
                    style={{ fontFamily: "PressStart2P_400Regular" }}
                >
                    Busy Blocks
                </Text>
            </View>

            {isGoogleConnected ? (
                <View className="border-2 border-dashed border-white/30 p-5">
                    <Text className="text-white/70 font-mono uppercase mb-5 leading-5 text-xs">
                        Google Calendar Linked!
                    </Text>

                    <PrimaryButton
                        label="Fetch Data"
                        onPress={onSyncCalendar}
                        loading={isLoading}
                    />
                </View>
            ) : (
                <View className="flex flex-col gap-4">
                    <TextPrimaryInput
                        label="Start Time"
                        value={start}
                        onChangeText={onStartChange}
                        placeholder="HH:MM"
                    />
                    <TextPrimaryInput
                        label="End Time"
                        value={end}
                        onChangeText={onEndChange}
                        placeholder="HH:MM"
                    />
                    <PrimaryButton label="Add Block" onPress={onAddEvent} />
                </View>
            )}

            <View className="mt-4">
                {calendar.map((item) => (
                    <View key={item.id} className="mb-6">
                        <Text className="mb-3 text-[10px] font-black uppercase tracking-widest text-white/50 border-b-2 border-white/10 pb-2">
                            {item.name}
                        </Text>

                        <View className="flex flex-col gap-1">
                            {item.busy.length > 0 ? (
                                item.busy.map((slot, index) => (
                                    <View
                                        key={`${item.id}-${index}`}
                                        className={`flex flex-row items-center justify-between py-2 ${
                                            !isGoogleConnected
                                                ? "opacity-100"
                                                : "opacity-50"
                                        }`}
                                    >
                                        <Text className="text-white font-mono text-sm">
                                            {formatTime(slot.start)}{" "}
                                            <Text className="text-white/50">
                                                -{">"}
                                            </Text>{" "}
                                            {formatTime(slot.end)}
                                        </Text>
                                        {!isGoogleConnected && (
                                            <Pressable
                                                onPress={() =>
                                                    onRemoveEvent(index)
                                                }
                                                className="px-2 py-1"
                                            >
                                                {({ pressed }) => (
                                                    <Text
                                                        className={`font-mono text-xs ${pressed ? "text-red-400" : "text-white/50"}`}
                                                    >
                                                        X
                                                    </Text>
                                                )}
                                            </Pressable>
                                        )}
                                    </View>
                                ))
                            ) : (
                                <Text className="text-white/30 font-mono text-xs uppercase py-2">
                                    Empty!
                                </Text>
                            )}
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}
