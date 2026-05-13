import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { AreaDisplay } from "../../components/calendar/AreaDisplay";
import { useCalendarEngine } from "../../hooks/useCalendarsHelper";
import { BusyBlocks } from "../../components/reschedule/BusyBlocks";
import { ReschedulingStylePicker } from "../../components/reschedule/ReschedulingStylePicker";
import { OutputTimeline } from "../../components/reschedule/OutputTimeline";

export default function Reschedule() {
    const [algorithm, setAlgorithm] = useState<"global" | "nested">("global");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const {
        calendar,
        isGeneratedOnce,
        finalSchedule,
        isLoading,
        isScheduleLoading,
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
            <View className="flex flex-col gap-2 pb-5 border-b-2 border-b-accent">
                <Text className="text-xl font-bold">Reschedule</Text>
                <Text>
                    Derailed? Don't worry, you can reschedule your day here!
                </Text>
            </View>

            <BusyBlocks
                isGoogleConnected={isGoogleConnected}
                isLoading={isLoading}
                start={start}
                end={end}
                onStartChange={setStart}
                onEndChange={setEnd}
                onAddEvent={handleAddEvent}
                onSyncCalendar={actions.getData}
                calendar={calendar}
                onRemoveEvent={actions.removeManualEvent}
                formatTime={formatTime}
            />

            <ReschedulingStylePicker
                algorithm={algorithm}
                onAlgorithmChange={setAlgorithm}
                onReschedule={() => actions.runReschedule(algorithm)}
            />

            <AreaDisplay
                areasDataOverride={schedule}
                isLoadingOverride={isScheduleLoading}
            />

            <OutputTimeline
                finalSchedule={finalSchedule}
                isGeneratedOnce={isGeneratedOnce}
                isLoading={isLoading}
                onSaveToDatabase={actions.saveToDatabase}
                formatTime={formatTime}
            />
        </ScrollView>
    );
}
