import { Text, View, Pressable, ScrollView } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "expo-router";
import { PlanSection } from "../../components/dashboard/PlanSection";

export default function Dashboard() {
    const { user } = useAuth();
    const router = useRouter();

    const now = new Date();
    const weekday = now.toLocaleDateString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName="pb-5 flex flex-col gap-5"
        >
            <View className="w-full p-5 text-center">
                <Text className="text-center text-[2px] font-semibold text-slate-400">
                    {weekday}
                </Text>

                <View className="mt-5 flex flex-col gap-2">
                    <Text
                        className="text-center text-3xl font-black tracking-tight text-white"
                        style={{ fontFamily: "PressStart2P_400Regular" }}
                    >
                        Hey, {user?.username ?? "User"}!
                    </Text>
                    <Text className="text-center text-base leading-6 text-slate-300">
                        Your schedule is the run. Keep the streak alive, reroute
                        the day, and lock in the next move.
                    </Text>
                    <Text className="text-center text-base leading-6 text-slate-300">
                        You got this :)
                    </Text>
                </View>
            </View>
            <PlanSection />
        </ScrollView>
    );
}
