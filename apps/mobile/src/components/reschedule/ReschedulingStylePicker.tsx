import { Pressable, Text, View } from "react-native";

type ReschedulingStylePickerProps = {
    algorithm: "global" | "nested";
    onAlgorithmChange: (algo: "global" | "nested") => void;
    onReschedule: () => void;
};

export function ReschedulingStylePicker({
    algorithm,
    onAlgorithmChange,
    onReschedule,
}: ReschedulingStylePickerProps) {
    return (
        <View className="flex flex-col gap-4">
            <View className="flex flex-col gap-1">
                <Text className="text-xl font-black">Rescheduling Style</Text>
            </View>

            <View className="flex flex-row items-stretch gap-3 max-w-full">
                <Pressable
                    onPress={() => onAlgorithmChange("global")}
                    className={`flex flex-col gap-2 flex-1 rounded-3xl border-2 px-5 py-5 transition-all ${
                        algorithm === "global"
                            ? "border-primary bg-primary"
                            : "border-border/50 bg-card shadow-sm"
                    }`}
                >
                    <Text className="text-lg font-black">Classic</Text>
                    <Text className="text-sm font-medium text-text/70">
                        Smooth blend of all categories
                    </Text>
                </Pressable>
                <Pressable
                    onPress={() => onAlgorithmChange("nested")}
                    className={`flex flex-col gap-2 flex-1 rounded-3xl border-2 px-5 py-5 transition-all ${
                        algorithm === "nested"
                            ? "border-primary bg-primary"
                            : "border-border/50 bg-card shadow-sm"
                    }`}
                >
                    <Text className="text-lg font-black">Specialist</Text>
                    <Text className="text-sm font-medium text-text/70">
                        Organized by area & subarea
                    </Text>
                </Pressable>
            </View>
            <Pressable
                onPress={onReschedule}
                className="w-full bg-linear-to-r from-primary to-primary/80 rounded-2xl py-4 shadow-lg transition-all"
            >
                <Text className="text-white font-semibold text-center">
                    Reschedule
                </Text>
            </Pressable>
        </View>
    );
}
