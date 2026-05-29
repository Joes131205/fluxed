import { Text, View, Pressable, ScrollView } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "expo-router";
import { PlanSection } from "../../components/dashboard/PlanSection";

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName="flex flex-col gap-6 py-8 px-4"
        >
            <View className="border border-primary bg-card p-4 shadow-[0_0_8px_rgba(0,255,65,0.15)] relative">
                <View className="flex-row justify-between items-start">
                    <View className="flex-col gap-1">
                        <Text className="text-primary text-2xl font-bold tracking-tight">
                            {user?.username ?? "Username"}
                        </Text>
                        <Text className="text-white text-xs font-medium font-mono">
                            You got this! :D
                        </Text>
                    </View>
                </View>
            </View>

            <PlanSection />
        </ScrollView>
    );
}
