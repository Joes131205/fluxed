import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
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
            className="flex-1 bg-background "
            contentContainerClassName="px-5 pt-10 pb-32 flex flex-col gap-5"
        >
            <View className="flex flex-col pb-6 mb-6 border-b-2 border-dashed border-white/30">
                <Text
                    className="text-2xl text-white uppercase"
                    style={{ fontFamily: "PressStart2P_400Regular" }}
                >
                    Reschedule
                </Text>

                <Text className="mt-3 text-xs text-white/70 font-mono uppercase tracking-widest leading-5">
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
