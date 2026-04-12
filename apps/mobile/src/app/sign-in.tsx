import { useRouter } from "expo-router";
import { useState } from "react";
import axios from "axios";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import { API_URL } from "../lib/env";
import { authClient } from "../lib/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthResponse = {
    ok?: boolean;
    token?: string;
    error?: string;
};

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
            console.log(API_URL);
            const response = await authClient.login.$post({
                json: { email, password },
            });

            const contentType = response.headers.get("content-type") ?? "";
            const isJson = contentType.includes("application/json");

            let data: AuthResponse | null = null;
            let rawBody = "";

            if (isJson) {
                data = (await response.json()) as AuthResponse;
            } else {
                rawBody = await response.text();
            }

            if (!response.ok) {
                const errorMessage =
                    data?.error ||
                    (rawBody ? rawBody.slice(0, 120) : "Invalid credentials");
                Alert.alert("Sign In Failed", errorMessage);
                return;
            }

            if (!data?.token) {
                Alert.alert(
                    "Sign In Failed",
                    "Server response did not include an auth token.",
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
