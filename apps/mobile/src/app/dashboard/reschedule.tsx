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
        isGeneratedOnce,
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

            <View className="flex flex-col gap-3">
                <Text className="text-xl font-bold">Busy Blocks</Text>

                {isGoogleConnected ? (
                    <View className="rounded-xl border border-primary/30 bg-primary/10 p-4 flex flex-col gap-3">
                        <Text className="font-semibold text-primary">
                            Google calendar connected
                        </Text>
                        <Text className="text-sm text-text/70">
                            Sync your calendar to load your latest busy blocks
                            before rescheduling.
                        </Text>
                        <Pressable
                            onPress={actions.getData}
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

            <View className="flex flex-col gap-4">
                <View className="flex flex-col gap-1">
                    <Text className="text-xl font-black">
                        Rescheduling Style
                    </Text>
                </View>

                <View className="flex flex-row items-stretch gap-3 max-w-full">
                    <Pressable
                        onPress={() => setAlgorithm("global")}
                        className={`flex flex-col gap-2 flex-1 rounded-3xl border-2 px-5 py-5 transition-all ${
                            algorithm === "global"
                                ? "border-primary bg-linear-to-br from-primary/20 to-primary/5 shadow-lg scale-105"
                                : "border-border/50 bg-card shadow-sm"
                        }`}
                    >
                        <Text className="text-lg font-black">✨ Classic</Text>
                        <Text className="text-sm font-medium text-text/70">
                            Smooth blend of all categories
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setAlgorithm("nested")}
                        className={`flex flex-col gap-2 flex-1 rounded-3xl border-2 px-5 py-5 transition-all ${
                            algorithm === "nested"
                                ? "border-primary bg-linear-to-br from-primary/20 to-primary/5 shadow-lg scale-105"
                                : "border-border/50 bg-card shadow-sm"
                        }`}
                    >
                        <Text className="text-lg font-black">
                            🎯 Specialist
                        </Text>
                        <Text className="text-sm font-medium text-text/70">
                            Organized by area & subarea
                        </Text>
                    </Pressable>
                </View>
                <Pressable
                    onPress={() => actions.runReschedule(algorithm)}
                    className="w-full bg-linear-to-r from-primary to-primary/80 rounded-2xl py-4 shadow-lg transition-all"
                >
                    <Text className="text-white font-semibold text-center">
                        Reschedule
                    </Text>
                </Pressable>
            </View>

            <AreaDisplay areasDataOverride={schedule} />

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
                                onPress={actions.saveToDatabase}
                                className="w-full rounded-md bg-primary px-4 py-3"
                            >
                                <Text className="text-center font-semibold text-white">
                                    {isLoading
                                        ? "Saving..."
                                        : "Save to Database"}
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
                            Maybe because the allocated events are too close to
                            your sleep window or you set the minimum task
                            duration too big or no areas and subareas?
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
        </ScrollView>
    );
}
