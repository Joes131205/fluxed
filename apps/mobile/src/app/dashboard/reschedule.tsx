import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { AreaDisplay } from "../../components/calendar/AreaDisplay";
import { useCalendarEngine } from "../../hooks/useCalendarsHelper";

export default function Reschedule() {
    const [algorithm, setAlgorithm] = useState<"global" | "nested">("global");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const {
        calendar,
        minutes,
        rescheduledData,
        finalSchedule,
        isLoading,
        error,
        user,
        schedule,
        actions,
    } = useCalendarEngine();

    const isGoogleConnected = !!user?.googleId;

    const calendarBlocks = useMemo(
        () => calendar.reduce((acc, item) => acc + item.busy.length, 0),
        [calendar],
    );

    const formatTime = (isoDate: string) => {
        return new Date(isoDate).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleAddEvent = () => {
        actions.addManualEvent(start, end);
        setStart("");
        setEnd("");
    };

    return (
        <ScrollView
            className="flex-1 bg-background "
            contentContainerClassName="px-5 pt-10 pb-32 flex flex-col gap-10"
        >
            <View className="flex flex-col gap-2">
                <Text className="text-2xl font-bold text-center">
                    Reschedule
                </Text>
                <Text className="text-center">
                    Derailed? No problem, reschedule here!
                </Text>
                <Pressable
                    onPress={actions.loadDemoData}
                    className="self-center rounded-md border border-border bg-card px-4 py-2"
                >
                    <Text className="font-semibold">Load Demo Data</Text>
                </Pressable>
                {error ? <Text className="text-red-500">{error}</Text> : null}
            </View>

            <View className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4">
                <Text className="text-xl font-bold">
                    {isGoogleConnected
                        ? "Google Calendar Busy Times"
                        : "Manual Busy Blocks"}
                </Text>

                {isGoogleConnected ? (
                    <Pressable
                        onPress={actions.getData}
                        className="w-full rounded-md bg-primary px-4 py-2"
                    >
                        <Text className="text-center font-semibold text-white">
                            {isLoading ? "Syncing..." : "Sync Calendar"}
                        </Text>
                    </Pressable>
                ) : (
                    <>
                        <TextInput
                            value={start}
                            onChangeText={setStart}
                            placeholder="Start (HH:MM)"
                            className="rounded-md border border-border bg-white px-3 py-2"
                        />
                        <TextInput
                            value={end}
                            onChangeText={setEnd}
                            placeholder="End (HH:MM)"
                            className="rounded-md border border-border bg-white px-3 py-2"
                        />
                        <Pressable
                            onPress={handleAddEvent}
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
                            {item.busy.map((slot, index) => (
                                <Pressable
                                    key={`${item.id}-${index}`}
                                    onPress={() =>
                                        !isGoogleConnected &&
                                        actions.removeManualEvent(index)
                                    }
                                    className="rounded-md border border-border px-3 py-2"
                                >
                                    <Text>
                                        {formatTime(slot.start)} -{" "}
                                        {formatTime(slot.end)}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                ))}
            </View>

            <View className="flex flex-col gap-2">
                <Text className="text-2xl font-bold text-center">
                    Choose your rescheduling style
                </Text>
                <View className="flex flex-row items-center gap-5 max-w-full">
                    <Pressable
                        onPress={() => setAlgorithm("global")}
                        className={`flex flex-col gap-1 flex-1 rounded-2xl border p-4 ${
                            algorithm === "global"
                                ? "border-primary bg-primary/10"
                                : "border-border bg-card"
                        }`}
                    >
                        <Text className="text-xl font-bold">Classic</Text>
                        <Text>Smooth mix of all of your categories.</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setAlgorithm("nested")}
                        className={`flex flex-col gap-1 flex-1 rounded-2xl border p-4 ${
                            algorithm === "nested"
                                ? "border-primary bg-primary/10"
                                : "border-border bg-card"
                        }`}
                    >
                        <Text className="text-xl font-bold">Specialist</Text>
                        <Text>Group priorities by area and then subarea.</Text>
                    </Pressable>
                </View>
                <Pressable
                    onPress={() => actions.runReschedule(algorithm)}
                    className="w-full bg-primary text-white p-x-3 py-2 text-center rounded-md"
                >
                    <Text className="text-white font-semibold text-center">
                        Reschedule
                    </Text>
                </Pressable>
            </View>

            <AreaDisplay areasDataOverride={schedule} />

            {finalSchedule.length > 0 ? (
                <View>
                    <Text className="text-xl font-bold">Timeline</Text>

                    <View className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
                        {finalSchedule.map((slot, index) => (
                            <View
                                key={`${slot.subareaId}-${index}`}
                                className="rounded-md border border-border bg-white p-3"
                            >
                                <Text className="font-semibold">
                                    {slot.subarea}
                                </Text>
                                <Text>
                                    {formatTime(slot.start)} -{" "}
                                    {formatTime(slot.end)}
                                </Text>
                            </View>
                        ))}

                        <Pressable
                            onPress={actions.saveToDatabase}
                            className="w-full rounded-md bg-primary px-4 py-3"
                        >
                            <Text className="text-center font-semibold text-white">
                                {isLoading ? "Saving..." : "Save to Database"}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            ) : null}
        </ScrollView>
    );
}
