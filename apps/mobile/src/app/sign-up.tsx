import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Text,
    TextInput,
    View,
    Pressable,
    Alert,
    ActivityIndicator,
    Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authClient } from "../lib/client";
import { API_URL } from "../lib/env";
import { useAuth } from "../hooks/useAuth";

export default function SignUp() {
    const { user } = useAuth();

    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    if (user) {
        router.replace("/dashboard");
    }
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
            const response = await authClient.register.$post({
                json: { username, email, password },
            });

            const data = (await response.json()) as {
                token?: string;
                error?: string;
            };

            if (!response.ok || !data.token) {
                Alert.alert("Sign Up Failed", data.error || "Unknown error");
                return;
            }

            await AsyncStorage.setItem("token", data.token);

            Alert.alert("Success", "Account created! Redirecting...", [
                {
                    text: "OK",
                    onPress: () => router.push("/dashboard"),
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
    const handleGoogleSignIn = async () => {
        try {
            await Linking.openURL(`${API_URL}/auth/google/start`);
        } catch (error) {
            Alert.alert(
                "Google Sign In Failed",
                error instanceof Error
                    ? error.message
                    : "Unable to open Google sign in",
            );
        }
    };
    return (
        <View className="flex flex-col items-center justify-center flex-1 gap-4 px-6">
            <Text className="text-3xl font-bold mb-6">Create Account</Text>

            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                className="w-full bg-white border border-primary rounded-lg px-4 py-3 text-base"
                editable={!loading}
            />

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                className="w-full bg-white border border-primary rounded-lg px-4 py-3 text-base"
                editable={!loading}
            />

            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                className="w-full bg-white border border-primary rounded-lg px-4 py-3 text-base"
                editable={!loading}
            />

            <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                className="w-full bg-white border border-primary rounded-lg px-4 py-3 text-base"
                editable={!loading}
            />

            <Pressable
                onPress={handleSignUp}
                disabled={loading}
                className="w-full bg-primary rounded-lg py-3 mt-4 flex items-center justify-center"
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white font-semibold text-base">
                        Sign Up
                    </Text>
                )}
            </Pressable>

            <View className="my-2 w-full flex-row items-center gap-3">
                <View className="h-px flex-1 bg-gray-300" />
                <Text className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                    or
                </Text>
                <View className="h-px flex-1 bg-gray-300" />
            </View>
            <Pressable
                onPress={handleGoogleSignIn}
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 bg-white px-5 py-3"
            >
                <View className="flex-row items-center justify-center gap-2">
                    <Text className="text-base font-black text-gray-700">
                        G
                    </Text>
                    <Text className="font-semibold text-gray-800">
                        Continue with Google
                    </Text>
                </View>
            </Pressable>
            <Pressable
                onPress={() => router.push("/sign-in")}
                disabled={loading}
            >
                <Text className="text-primary text-sm mt-4">
                    Already have an account? Sign In
                </Text>
            </Pressable>
        </View>
    );
}
