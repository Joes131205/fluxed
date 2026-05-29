import { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { AreaDisplay } from "../../components/calendar/AreaDisplay";
import { useCalendarEngine } from "../../hooks/useCalendarsHelper";
import { BusyBlocks } from "../../components/reschedule/BusyBlocks";
import { ReschedulingStylePicker } from "../../components/reschedule/ReschedulingStylePicker";
import { OutputTimeline } from "../../components/reschedule/OutputTimeline";

export default function Reschedule() {
    const algorithmType = [
        {
            type: "global",
            description: "Smooth blend of all categories",
        },
        {
            type: "nested",
            description: "Organized by area & subarea",
        },
    ];
    const [algorithmIdx, setAlgorithmIdx] = useState(0);
    const type = algorithmType[algorithmIdx].type;
    const description = algorithmType[algorithmIdx].description;

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
            className="flex-1 bg-background"
            contentContainerClassName="flex flex-col gap-6 py-8 px-4"
        >
            <View className="flex flex-col mb-2">
                <Text className="text-2xl font-bold text-primary tracking-tight mb-1">
                    Reschedule
                </Text>
                <View className="h-[2px] w-24 bg-primary mb-3 shadow-[0_0_8px_rgba(0,255,65,0.6)]" />
                <Text className="text-xs text-muted-foreground font-mono uppercase tracking-widest leading-5">
                    Derailed? Don't worry. You can reschedule your day here.
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
                algorithmTypes={algorithmType}
                onAlgorithmChange={setAlgorithmIdx}
                onReschedule={() => actions.runReschedule(type)}
                description={description}
                currentAlgorithm={type}
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
