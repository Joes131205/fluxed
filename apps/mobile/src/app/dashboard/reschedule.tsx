import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { AreaDisplay } from "../../components/reschedule/AreaDisplay";
import { useCalendarEngine } from "../../hooks/useCalendarsHelper";
import { BusyBlocks } from "../../components/reschedule/BusyBlocks";
import { ReschedulingStylePicker } from "../../components/reschedule/ReschedulingStylePicker";
import { OutputTimeline } from "../../components/reschedule/OutputTimeline";
import { AreaSectionItem } from "../../components/reschedule/AreaSection";
import { TextPrimaryInput } from "../../components/ui/TextPrimaryInput";
import { SecondaryButton } from "../../components/ui/SecondaryButton";
import { PageHeader } from "../../components/ui/PageHeader";

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
    const [temporaryTask, setTemporaryTask] = useState("");
    const [temporaryWeight, setTemporaryWeight] = useState("1");

    const {
        calendar,
        isGeneratedOnce,
        finalSchedule,
        isLoading,
        isAreaLoading,
        isPlanLoading,
        isScheduleLoading,
        user,
        schedule,
        actions,
        toggleAreaExclude,
        toggleSubareaExclude,
    } = useCalendarEngine();

    const isGoogleConnected = !!user?.googleId;

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

    const handleInjectTask = () => {
        if (!temporaryTask.trim()) return;
        actions.addTemporaryTask(temporaryTask.trim(), Number(temporaryWeight));
        setTemporaryTask("");
        setTemporaryWeight("1");
    };

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName="flex flex-col gap-6 py-8 px-4"
        >
            <PageHeader
                title="Rescheduler"
                description="Derailed? No problem, reschedule it here!"
            />

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

            <View className="flex flex-col border border-muted bg-card p-4 mt-2">
                <Text className="text-xs font-bold text-primary uppercase tracking-widest">
                    Add Temporary Task
                </Text>
                <TextPrimaryInput
                    placeholder="Enter the task here..."
                    value={temporaryTask}
                    onChangeText={setTemporaryTask}
                />
                <TextPrimaryInput
                    value={temporaryWeight}
                    keyboardType="number-pad"
                    placeholder="Enter the task weight here..."
                    onChangeText={setTemporaryWeight}
                />
                <SecondaryButton label={"Add"} onPress={handleInjectTask} />
            </View>
            <AreaDisplay
                areasDataOverride={schedule as AreaSectionItem[]}
                isLoadingOverride={isScheduleLoading}
                onToggleExclude={toggleAreaExclude}
                onToggleSubareaExclude={toggleSubareaExclude}
            />
            <ReschedulingStylePicker
                algorithmTypes={algorithmType}
                onAlgorithmChange={setAlgorithmIdx}
                onReschedule={() => actions.runReschedule(type, schedule)}
                isAreaLoading={isAreaLoading}
                description={description}
                currentAlgorithm={type}
            />
            <OutputTimeline
                finalSchedule={finalSchedule}
                isGoogleLinked={isGoogleConnected}
                isGeneratedOnce={isGeneratedOnce}
                isLoading={isLoading}
                isAreaLoading={isAreaLoading}
                onSaveToDatabase={actions.saveToDatabase}
                onSaveToGCal={actions.saveToGCal}
                formatTime={formatTime}
                onChangeTime={actions.changeTime}
            />
        </ScrollView>
    );
}
