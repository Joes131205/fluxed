import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { PrimaryButton } from "../ui/PrimaryButton";
import { SecondaryButton } from "../ui/SecondaryButton";

type OutputTimelineProps = {
    finalSchedule: Array<{
        subareaId: string;
        area: string;
        subarea: string;
        start: string;
        end: string;
    }>;
    isGoogleLinked: boolean;
    isGeneratedOnce: boolean;
    isLoading: boolean;
    onSaveToDatabase: () => void;
    onSaveToGCal: () => void;
    formatTime: (isoDate: string) => string;
    onChangeTime?: (idx: number, start: string, end: string) => void;
};

export function OutputTimeline({
    finalSchedule,
    isGoogleLinked,
    isGeneratedOnce,
    isLoading,
    onSaveToDatabase,
    onSaveToGCal,
    formatTime,
    onChangeTime,
}: OutputTimelineProps) {
    const [editingIdx, setEditingIdx] = useState<number | null>(null);
    const [tempStart, setTempStart] = useState("");
    const [tempEnd, setTempEnd] = useState("");

    const handleStartEdit = (idx: number, start: string, end: string) => {
        setEditingIdx(idx);
        setTempStart(formatTime(start).split(" ")[0]);
        setTempEnd(formatTime(end).split(" ")[0]);
    };

    const handleSaveEdit = (idx: number) => {
        if (onChangeTime) {
            onChangeTime(idx, tempStart, tempEnd);
        }
        setEditingIdx(null);
    };

    return (
        <View className="flex flex-col border border-primary/50 bg-card p-5 mt-2">
            <Text className="text-sm font-bold text-primary uppercase tracking-widest mb-4 border-b border-primary/20 pb-2">
                Proposed Timeline
            </Text>

            {finalSchedule.length > 0 ? (
                <View className="mb-6">
                    <View className="flex flex-col gap-3">
                        {finalSchedule.map((slot: any, idx: number) => (
                            <View
                                key={`${slot.subareaId}-${idx}`}
                                className="flex-row"
                            >
                                <View className="w-1 bg-primary/40 mr-3" />

                                {editingIdx === idx ? (
                                    <View className="flex-1 border border-primary bg-primary/5 p-4">
                                        <Text className="mb-3 text-[10px] font-black uppercase tracking-widest text-primary">
                                            Adjusting: {slot.subarea}
                                        </Text>

                                        <View className="flex-col items-center gap-3 mb-4">
                                            <TextInput
                                                className="flex-1 bg-background border border-muted text-foreground font-mono text-center py-2 outline-none"
                                                value={tempStart}
                                                onChangeText={setTempStart}
                                                placeholder="HH:MM"
                                                placeholderTextColor="#737373"
                                                selectionColor="#008c23"
                                            />
                                            <Text className="text-primary font-mono font-bold">
                                                -
                                            </Text>
                                            <TextInput
                                                className="flex-1 bg-background border border-muted text-foreground font-mono text-center py-2 outline-none"
                                                value={tempEnd}
                                                onChangeText={setTempEnd}
                                                placeholder="HH:MM"
                                                placeholderTextColor="#737373"
                                                selectionColor="#008c23"
                                            />
                                        </View>

                                        <View className="flex-row gap-3">
                                            <Pressable
                                                onPress={() =>
                                                    setEditingIdx(null)
                                                }
                                                className="flex-1 py-2 border border-muted items-center active:bg-foreground/5 transition-colors"
                                            >
                                                <Text className="font-mono text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                                                    Cancel
                                                </Text>
                                            </Pressable>
                                            <Pressable
                                                onPress={() =>
                                                    handleSaveEdit(idx)
                                                }
                                                className="flex-1 py-2 bg-primary items-center active:bg-primary/80 transition-colors"
                                            >
                                                <Text className="font-mono text-[10px] text-background uppercase font-bold tracking-widest">
                                                    Save
                                                </Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                ) : (
                                    <View className="flex-1 flex-row items-center justify-between border border-muted bg-background p-4">
                                        <View className="flex-1 pr-4">
                                            <Text className="mb-1 text-[10px] font-black uppercase tracking-widest text-primary/70">
                                                {slot.area}
                                            </Text>
                                            <Text
                                                className="text-sm font-bold text-foreground uppercase"
                                                numberOfLines={2}
                                            >
                                                {slot.subarea}
                                            </Text>
                                        </View>

                                        <View className="items-end gap-2">
                                            <View className="items-end">
                                                <Text className="font-mono text-sm font-bold text-primary">
                                                    {formatTime(slot.start)}
                                                </Text>
                                                <Text className="mt-1 font-mono text-[10px] font-bold text-muted-foreground">
                                                    {formatTime(slot.end)}
                                                </Text>
                                            </View>

                                            <Pressable
                                                onPress={() =>
                                                    handleStartEdit(
                                                        idx,
                                                        slot.start,
                                                        slot.end,
                                                    )
                                                }
                                                className="px-2 py-1 border border-primary/30 bg-primary/10 active:bg-primary/20 transition-colors mt-1"
                                            >
                                                <Text className="font-mono text-[10px] text-primary uppercase font-bold tracking-widest">
                                                    Edit
                                                </Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>

                    <View className="mt-6 border-t border-muted pt-4">
                        <PrimaryButton
                            onPress={onSaveToDatabase}
                            label={isLoading ? "Processing..." : "Confirm Plan"}
                            loading={isLoading}
                        />
                        {isGoogleLinked && (
                            <SecondaryButton
                                onPress={onSaveToGCal}
                                label={
                                    isLoading
                                        ? "Processing..."
                                        : "Save to Google Calendar"
                                }
                                loading={isLoading}
                            />
                        )}
                    </View>
                </View>
            ) : isGeneratedOnce ? (
                <View className="border border-destructive/30 bg-destructive/5 p-5 mt-2">
                    <Text className="text-lg font-bold text-destructive mb-2 font-mono uppercase tracking-widest">
                        Generation Failed
                    </Text>
                    <Text className="text-xs text-destructive/80 font-mono leading-5">
                        No valid slots available for the current timeframe.
                        Ensure minimum duration parameters and sleep windows do
                        not overlap with required task weightings.
                    </Text>
                </View>
            ) : (
                <View className="border border-foreground/10 bg-background p-6 items-center">
                    <Text className="text-sm font-bold text-muted-foreground font-mono uppercase tracking-widest">
                        Standing By
                    </Text>
                </View>
            )}
        </View>
    );
}
