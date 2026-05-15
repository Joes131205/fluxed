import { Pressable, ScrollView, Text, View } from "react-native";
import { PrimaryButton } from "../ui/PrimaryButton";

type ReschedulingStylePickerProps = {
    algorithmTypes: Array<{
        type: string;
        description: string;
    }>;
    onAlgorithmChange: (idx: number) => void;
    onReschedule: () => void;
    currentAlgorithm: string;
    description: string;
};

export function ReschedulingStylePicker({
    algorithmTypes,
    onAlgorithmChange,
    onReschedule,
    currentAlgorithm,
    description,
}: ReschedulingStylePickerProps) {
    return (
        <View className="flex flex-col gap-4">
            <View className="border-b-2 border-dashed border-white/30 pb-4">
                <Text
                    className="text-xl text-white uppercase"
                    style={{ fontFamily: "PressStart2P_400Regular" }}
                >
                    Rescheduling Style
                </Text>
            </View>
            <View className="mb-8">
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                        paddingBottom: 8,
                    }}
                >
                    {algorithmTypes.map((item, idx) => {
                        const isActive =
                            currentAlgorithm.toLowerCase() ===
                            item.type.toLowerCase();

                        return (
                            <Pressable
                                key={idx}
                                onPress={() => onAlgorithmChange(idx)}
                            >
                                {({ pressed }) => (
                                    <View
                                        className={`
                                px-5 py-3 border-2 
                                ${
                                    isActive
                                        ? "bg-white border-white"
                                        : "bg-black border-white/30 border-dashed"
                                }
                                ${pressed && !isActive ? "bg-white/10" : ""}
                            `}
                                    >
                                        <Text
                                            className={`uppercase tracking-widest text-xs font-black ${
                                                isActive
                                                    ? "text-black"
                                                    : "text-white/50"
                                            }`}
                                        >
                                            {item.type}
                                        </Text>
                                    </View>
                                )}
                            </Pressable>
                        );
                    })}
                </ScrollView>

                <View className="mt-4 border-2 border-white/30 p-5">
                    <Text
                        className="text-lg text-white uppercase mb-4"
                        style={{ fontFamily: "PressStart2P_400Regular" }}
                    >
                        {currentAlgorithm}
                    </Text>

                    <View className="flex-row">
                        <Text className="flex-1 text-white/80 font-mono text-sm leading-6">
                            {description}
                        </Text>
                    </View>
                </View>
            </View>
            <PrimaryButton label={"Reschedule"} onPress={onReschedule} />
        </View>
    );
}
