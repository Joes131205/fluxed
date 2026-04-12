import { Text, View, Pressable, ScrollView } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "expo-router";
import { PlanSection } from "../../components/dashboard/PlanSection";

export default function Dashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const now = new Date();
    const weekday = now.toLocaleDateString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const formatTime = (value: string | null | undefined) => {
        if (!value) return "Not set";

        if (/^\d{2}:\d{2}/.test(value)) {
            return new Date(`1970-01-01T${value}`).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });
        }

        return new Date(value).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleSignOut = async () => {
        await logout();
        router.replace("/sign-in");
    };

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName="px-5 pt-10 pb-32"
        >
            <View className="rounded-3xl border border-border bg-card p-5 flex flex-col gap-2">
                <Text className=" font-semibold uppercase tracking-widest text-muted-foreground">
                    {weekday}
                </Text>
                <Text className="mt-2 text-3xl font-bold text-foreground">
                    Hey, {user?.username ?? "User"}
                </Text>
                <Text className="mt-2 text-sm text-muted-foreground">
                    Is today your day?
                </Text>
                <Pressable
                    className="w-full bg-primary text-white p-x-3 py-2 text-center rounded-md"
                    onPress={() => router.push("/dashboard/reschedule")}
                >
                    <Text className="text-white font-semibold text-center">
                        Reschedule
                    </Text>
                </Pressable>
            </View>
            <PlanSection />
        </ScrollView>
    );
}
