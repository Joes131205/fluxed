import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

export default function SignIn() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${process.env.API_URL || "http://localhost:3000"}/api/auth/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                },
            );

            if (!response.ok) {
                const error = await response.json();
                Alert.alert("Sign Up Failed", error.error || "Unknown error");
                return;
            }

            const data = await response.json();

            if (typeof localStorage !== "undefined") {
                localStorage.setItem("token", data.token);
            }

            Alert.alert("Success", "Account created! Redirecting...", [
                {
                    text: "OK",
                    onPress: () => router.push("/"),
                },
            ]);
        } catch (error) {
            Alert.alert(
                "Error",
                error instanceof Error ? error.message : "Network error",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex flex-col items-center justify-center flex-1 gap-4 px-6">
            <Text className="text-3xl font-bold mb-6">Log In</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base"
                editable={!loading}
            />

            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base"
                editable={!loading}
            />

            <Pressable
                onPress={handleSignIn}
                disabled={loading}
                className="w-full bg-blue-500 rounded-lg py-3 mt-4 flex items-center justify-center"
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white font-semibold text-base">
                        Sign In
                    </Text>
                )}
            </Pressable>

            <Pressable
                onPress={() => router.push("/sign-up")}
                disabled={loading}
            >
                <Text className="text-blue-500 text-sm mt-4">
                    Don't have an account? Sign Up
                </Text>
            </Pressable>
        </View>
    );
}
