import { Text, View, Pressable, ScrollView } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "expo-router";
import { PlanSection } from "../../components/dashboard/PlanSection";

export default function Dashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();

    return (
        <ScrollView className="flex-1 flex flex-col gap-2">
            <Text>Hello! {user?.username}!</Text>
            <PlanSection />
        </ScrollView>
    );
}
