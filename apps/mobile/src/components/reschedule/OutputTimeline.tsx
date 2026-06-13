import { Pressable, Text, View } from "react-native";
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
};
export function OutputTimeline({
    finalSchedule,
    isGoogleLinked,
    isGeneratedOnce,
    isLoading,
    onSaveToDatabase,
    onSaveToGCal,
    formatTime,
}: OutputTimelineProps) {
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

                                    <View className="items-end">
                                        <Text className="font-mono text-sm font-bold text-primary">
                                            {formatTime(slot.start)}
                                        </Text>
                                        <Text className="mt-1 font-mono text-[10px] font-bold text-muted-foreground">
                                            {formatTime(slot.end)}
                                        </Text>
                                    </View>
                                </View>
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
