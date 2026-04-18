import { Pressable, Text, TextInput, View } from "react-native";

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
        <View className="flex flex-col gap-3">
            <Text className="text-xl font-bold">Busy Blocks</Text>

            {isGoogleConnected ? (
                <View className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex flex-col gap-3">
                    <Text className="font-semibold text-primary">
                        Google calendar connected
                    </Text>
                    <Text className="text-sm text-text/70">
                        Sync your calendar to load your latest busy blocks
                        before rescheduling.
                    </Text>
                    <Pressable
                        onPress={onSyncCalendar}
                        className="w-full rounded-md bg-primary px-4 py-2"
                    >
                        <Text className="text-center font-semibold text-white">
                            {isLoading ? "Syncing..." : "Sync Calendar"}
                        </Text>
                    </Pressable>
                </View>
            ) : (
                <>
                    <TextInput
                        value={start}
                        onChangeText={onStartChange}
                        placeholder="Start (HH:MM)"
                        className="rounded-md border border-border bg-white px-3 py-2"
                    />
                    <TextInput
                        value={end}
                        onChangeText={onEndChange}
                        placeholder="End (HH:MM)"
                        className="rounded-md border border-border bg-white px-3 py-2"
                    />
                    <Pressable
                        onPress={onAddEvent}
                        className="rounded-md bg-primary px-4 py-2"
                    >
                        <Text className="text-center font-semibold text-white">
                            Add Event
                        </Text>
                    </Pressable>
                </>
            )}

            {calendar.map((item) => (
                <View
                    key={item.id}
                    className="mt-2 rounded-xl border border-border bg-white p-3"
                >
                    <Text className="font-semibold">{item.name}</Text>
                    <View className="mt-2 flex flex-col gap-2">
                        {item.busy.length > 0 ? (
                            item.busy.map((slot, index) => (
                                <Pressable
                                    key={`${item.id}-${index}`}
                                    onPress={() =>
                                        !isGoogleConnected &&
                                        onRemoveEvent(index)
                                    }
                                    className="rounded-md border border-border px-3 py-2"
                                >
                                    <Text>
                                        {formatTime(slot.start)} -{" "}
                                        {formatTime(slot.end)}
                                    </Text>
                                </Pressable>
                            ))
                        ) : (
                            <View className="flex flex-col gap-2">
                                <Text className="text-xs">Empty!</Text>
                            </View>
                        )}
                    </View>
                </View>
            ))}
        </View>
    );
}
