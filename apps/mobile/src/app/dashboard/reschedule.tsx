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
import { useSchedules } from "../../hooks/useSchedules";

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

    const { data: schedulesData, isLoading: isSchedulesLoading } =
        useSchedules();
    const schedules = schedulesData?.ok ? (schedulesData.data as any[]) : [];

    const [activeScheduleIds, setActiveScheduleIds] = useState<string[]>([]);

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

    const toggleRoutine = (id: string) => {
        const newActiveIds = activeScheduleIds.includes(id)
            ? activeScheduleIds.filter((item) => item !== id)
            : [...activeScheduleIds, id];

        setActiveScheduleIds(newActiveIds);

        const activeRoutines = schedules.filter((s) =>
            newActiveIds.includes(s.id),
        );
        const routineSlots: { start: string; end: string }[] = [];
        const now = new Date();

        activeRoutines.forEach((routine) => {
            routine.timeSlots.forEach((slot: any) => {
                const [startH, startM] = slot.start.split(":").map(Number);
                const [endH, endM] = slot.end.split(":").map(Number);

                const startDate = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate(),
                    startH,
                    startM,
                );
                const endDate = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate(),
                    endH,
                    endM,
                );

                routineSlots.push({
                    start: startDate.toISOString(),
                    end: endDate.toISOString(),
                });
            });
        });

        actions.applyRoutines(routineSlots);
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

            {!isSchedulesLoading && schedules.length > 0 && (
                <View className="mb-2">
                    <Text className="text-[10px] font-black uppercase tracking-widest text-primary/50 mb-3">
                        Apply Fixed Routines
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="flex-row gap-3"
                    >
                        {schedules.map((scheduleObj) => {
                            const isActive = activeScheduleIds.includes(
                                scheduleObj.id,
                            );
                            return (
                                <Pressable
                                    key={scheduleObj.id}
                                    onPress={() =>
                                        toggleRoutine(scheduleObj.id)
                                    }
                                    className={`px-4 py-2 border mr-2 transition-colors flex-row items-center gap-2 ${
                                        isActive
                                            ? "border-primary bg-primary/20 shadow-sm shadow-primary/30"
                                            : "border-primary/30 bg-card opacity-60"
                                    }`}
                                >
                                    <Text
                                        className={`font-mono text-xs uppercase tracking-widest ${isActive ? "text-primary font-bold" : "text-foreground"}`}
                                    >
                                        {scheduleObj.name}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                </View>
            )}

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
