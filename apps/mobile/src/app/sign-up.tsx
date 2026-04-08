import { useRouter } from "expo-router";
import { useState } from "react";
import axios from "axios";
import {
    Text,
    TextInput,
    View,
    Pressable,
    Alert,
    ActivityIndicator,
} from "react-native";

export default function SignUp() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!username || !email || !password || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords don't match");
            return;
        }
        if (password.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            console.log(
                `${process.env.API_URL || "http://localhost:3000"}/api/auth/register`,
            );
            const response = await axios.post(
                `${process.env.API_URL || "http://localhost:3000"}/api/auth/register`,
                { username, email, password },
                {
                    headers: { "Content-Type": "application/json" },
                },
            );
            const data = response.data as { token: string };

            if (typeof localStorage !== "undefined") {
                localStorage.setItem("token", data.token);
            }

            Alert.alert("Success", "Account created! Redirecting...", [
                {
                    text: "OK",
                    onPress: () => router.push("/dashboard"),
                },
            ]);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const apiError = (error.response.data as { error?: string })
                    ?.error;
                Alert.alert("Sign Up Failed", apiError || "Unknown error");
                return;
            }

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
            <Text className="text-3xl font-bold mb-6">Create Account</Text>

            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base"
                editable={!loading}
            />

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

            <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base"
                editable={!loading}
            />

            <Pressable
                onPress={handleSignUp}
                disabled={loading}
                className="w-full bg-blue-500 rounded-lg py-3 mt-4 flex items-center justify-center"
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white font-semibold text-base">
                        Sign Up
                    </Text>
                )}
            </Pressable>

            <Pressable
                onPress={() => router.push("/sign-in")}
                disabled={loading}
            >
                <Text className="text-blue-500 text-sm mt-4">
                    Already have an account? Sign In
                </Text>
            </Pressable>
        </View>
    );
}
