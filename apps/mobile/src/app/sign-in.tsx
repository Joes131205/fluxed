import { useRouter } from "expo-router";
import { useState } from "react";
import axios from "axios";
import {
    ActivityIndicator,
    Alert,
    Linking,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import { API_URL } from "../lib/env";
import { authClient } from "../lib/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../hooks/useAuth";

export default function SignIn() {
    const { user } = useAuth();

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    if (user) {
        router.replace("/dashboard");
    }
    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);

        try {
            console.log(API_URL);
            const response = await authClient.login.$post({
                json: { email, password },
            });

            const data = (await response.json()) as {
                token?: string;
                error?: string;
            };

            if (!response.ok || !data.token) {
                Alert.alert(
                    "Sign In Failed",
                    data.error || "Unable to sign in",
                );
                return;
            }

            await AsyncStorage.setItem("token", data.token);

            Alert.alert("Success", "Signed in! Redirecting...", [
                {
                    text: "OK",
                    onPress: () => router.push("/dashboard"),
                },
            ]);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const apiError = (error.response.data as { error?: string })
                    ?.error;
                Alert.alert("Sign In Failed", apiError || "Unknown error");
                return;
            }
            console.log(error);
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
            await Linking.openURL(`${API_URL}/api/auth/google/start`);
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
