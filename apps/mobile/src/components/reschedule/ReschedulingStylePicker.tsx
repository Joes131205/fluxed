import { Pressable, ScrollView, Text, View } from "react-native";
import { PrimaryButton } from "../ui/PrimaryButton";

export function ReschedulingStylePicker({
    algorithmTypes,
    onAlgorithmChange,
    onReschedule,
    currentAlgorithm,
    description,
}: any) {
    return (
        <View className="flex flex-col border border-muted bg-card p-5">
            <Text className="text-sm font-bold text-primary uppercase tracking-widest mb-4">
                Algorithm Mode
            </Text>

            <View className="flex-row gap-3 mb-4">
                {algorithmTypes.map((item: any, idx: number) => {
                    const isActive =
                        currentAlgorithm.toLowerCase() ===
                        item.type.toLowerCase();
                    return (
                        <Pressable
                            key={idx}
                            onPress={() => onAlgorithmChange(idx)}
                            className="flex-1"
                        >
                            <View
                                className={`py-3 border-2 items-center transition-colors ${
                                    isActive
                                        ? "bg-primary/10 border-primary shadow-sm shadow-primary/20"
                                        : "bg-background border-muted"
                                }`}
                            >
                                <Text
                                    className={`uppercase tracking-widest text-xs font-bold font-mono ${
                                        isActive
                                            ? "text-primary"
                                            : "text-muted-foreground"
                                    }`}
                                >
                                    {item.type}
                                </Text>
                            </View>
                        </Pressable>
                    );
                })}
            </View>

            <View className="border-l-2 border-primary/50 pl-3 mb-6 bg-background py-3 pr-3">
                <Text className="text-foreground/70 font-mono text-xs leading-5">
                    {description}
                </Text>
            </View>

            <PrimaryButton label="Reschedule" onPress={onReschedule} />
        </View>
    );
}
