import { useRouter } from "expo-router";
import { Text, View, ScrollView, Pressable } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { PrimaryButton } from "../components/ui/PrimaryButton";

export default function App() {
    const router = useRouter();
    const { user } = useAuth();

    if (user?.id) {
        router.replace("/dashboard");
    }

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName="flex-1 justify-between px-6 pb-12 pt-16"
        >
            <View className="flex-row justify-center items-center gap-3">
                <Text
                    className="text-primary font-bold tracking-widest text-xl"
                    style={{ fontFamily: "PressStart2P_400Regular" }}
                >
                    FLUXED
                </Text>
            </View>

            <View className="flex flex-col items-center gap-6">
                <Text className="text-3xl text-primary font-bold tracking-tight text-center leading-10">
                    Sharpen your habits
                </Text>

                <Text className="text-xs text-muted-foreground font-mono text-center leading-6 px-2">
                    When life disrupts, we keep you on track.{" "}
                </Text>
            </View>

            <View className="flex flex-col gap-5">
                <View className="flex-row justify-center items-center gap-2">
                    <Text className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
                        Existing account?
                    </Text>
                    <Pressable onPress={() => router.push("/sign-in")}>
                        {({ pressed }) => (
                            <Text
                                className={`font-mono font-bold text-xs uppercase tracking-widest ${
                                    pressed
                                        ? "text-[#00f0ff]/50"
                                        : "text-[#00f0ff]"
                                }`}
                            >
                                Sign in.
                            </Text>
                        )}
                    </Pressable>
                </View>

                <PrimaryButton
                    label="GET STARTED"
                    onPress={() => router.push("/sign-up")}
                />
            </View>
        </ScrollView>
    );
}
