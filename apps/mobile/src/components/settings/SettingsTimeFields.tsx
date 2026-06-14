import { View } from "react-native";
import { TextPrimaryInput } from "../ui/TextPrimaryInput";

type SettingsTimeFieldsProps = {
    startTime: string;
    endTime: string;
    minDuration: string;
    timeBuffer: string;
    onStartTimeChange: (value: string) => void;
    onEndTimeChange: (value: string) => void;
    onMinDurationChange: (value: string) => void;
    onTimeBufferChange: (value: string) => void;
};

export function SettingsTimeFields({
    startTime,
    endTime,
    minDuration,
    timeBuffer,
    onStartTimeChange,
    onEndTimeChange,
    onMinDurationChange,
    onTimeBufferChange,
}: SettingsTimeFieldsProps) {
    return (
        <>
            <View className="flex-row gap-3">
                <View className="flex-1">
                    <TextPrimaryInput
                        label="Start (HH:MM)"
                        value={startTime}
                        onChangeText={onStartTimeChange}
                        placeholder="09:00"
                    />
                </View>

                <View className="flex-1">
                    <TextPrimaryInput
                        label="End (HH:MM)"
                        value={endTime}
                        onChangeText={onEndTimeChange}
                        placeholder="17:00"
                    />
                </View>
            </View>

            <View className="flex-row gap-3">
                <View className="flex-1">
                    <TextPrimaryInput
                        label="Min Task (Min)"
                        value={minDuration}
                        onChangeText={onMinDurationChange}
                        placeholder="30"
                        keyboardType="number-pad"
                    />
                </View>

                <View className="flex-1">
                    <TextPrimaryInput
                        label="Buffer (Min)"
                        value={timeBuffer}
                        onChangeText={onTimeBufferChange}
                        placeholder="15"
                        keyboardType="number-pad"
                    />
                </View>
            </View>
        </>
    );
}
