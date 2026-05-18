import { useRouter } from "expo-router";
import { Text, View, ScrollView } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { PrimaryButton } from "../components/ui/PrimaryButton";

export default function App() {
    const router = useRouter();

    const { user } = useAuth();

    if (user?.id) {
        router.navigate("/dashboard");
    }

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName=" flex flex-col gap-5 py-10 px-4"
        >
            {/* TODO: Logo */}
            <Text>Fluxed</Text>

            <View>
                <Text>An app where </Text>
            </View>
            <PrimaryButton
                label={"Sign In"}
                onPress={() => router.navigate("/sign-in")}
            />
        </ScrollView>
    );
}
