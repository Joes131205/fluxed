import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function Reschedule() {
    const [algorithm, setAlgorithm] = useState("global");
    return (
        <ScrollView
            className="flex-1 bg-background "
            contentContainerClassName="px-5 pt-10 pb-32 flex flex-col gap-10"
        >
            <View className="flex flex-col gap-2">
                <Text className="text-2xl font-bold text-center">
                    Reschedule
                </Text>
                <Text className="text-center">
                    Derailed? No problem, reschedule here!
                </Text>
            </View>
            <View className="flex flex-col gap-2">
                <Text className="text-2xl font-bold text-center">
                    Choose your rescheduling style
                </Text>
                <View className="flex flex-row items-center gap-5 max-w-full">
                    <Pressable
                        onPress={() => setAlgorithm("global")}
                        className={`flex flex-col gap-1 flex-1 rounded-2xl border p-4 ${
                            algorithm === "global"
                                ? "border-primary bg-primary/10"
                                : "border-border bg-card"
                        }`}
                    >
                        <Text className="text-xl font-bold">Classic</Text>
                        <Text>Smooth mix of all of your categories.</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setAlgorithm("nested")}
                        className={`flex flex-col gap-1 flex-1 rounded-2xl border p-4 ${
                            algorithm === "nested"
                                ? "border-primary bg-primary/10"
                                : "border-border bg-card"
                        }`}
                    >
                        <Text className="text-xl font-bold">Specialist</Text>
                        <Text>Group priorities by area and then subarea.</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}
