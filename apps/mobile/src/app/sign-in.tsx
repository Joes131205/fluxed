import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { API_URL } from "../lib/env";
import { authClient } from "../lib/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../hooks/useAuth";
import * as WebBrowser from "expo-web-browser";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { GoogleAuthButton } from "../components/ui/GoogleAuthButton";
import { TextPrimaryInput } from "../components/ui/TextPrimaryInput";

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
    const { user, getCurrentUser } = useAuth();

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            router.replace("/dashboard");
        }
    }, [router, user]);
    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);

        try {
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
            await getCurrentUser();
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
            const startUrl = `${API_URL}/auth/google/start?state=mobile`;
            const redirectUrl = "fluxed://auth-success";

            const result = await WebBrowser.openAuthSessionAsync(
                startUrl,
                redirectUrl,
            );

            if (result.type !== "success" || !result.url) {
                return;
            }

            const queryString = result.url.split("?")[1] ?? "";
            const params = new URLSearchParams(queryString);
            const token = params.get("token");
            const error = params.get("error");

            if (error) {
                Alert.alert("Google Sign In Failed", error);
                return;
            }

            if (!token) {
                Alert.alert("Google Sign In Failed", "Missing auth token.");
                return;
            }

            await AsyncStorage.setItem("token", token);
            router.replace("/dashboard");
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
        <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName="px-5 pt-10 pb-32"
        >
            <View className="flex flex-col items-center justify-center flex-1 gap-4 px-6">
                <Text className="text-3xl font-bold mb-6">Log In</Text>
                <TextPrimaryInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                />

                <TextPrimaryInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="password"
                    editable={!loading}
                />

                <PrimaryButton
                    label="Sign In"
                    onPress={handleSignIn}
                    loading={loading}
                />

                <View className="my-2 w-full flex-row items-center gap-3">
                    <View className="h-px flex-1 bg-gray-300" />
                    <Text className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                        or
                    </Text>
                    <View className="h-px flex-1 bg-gray-300" />
                </View>

                <GoogleAuthButton
                    onPress={handleGoogleSignIn}
                    loading={loading}
                />

                <Pressable
                    onPress={() => router.push("/sign-up")}
                    disabled={loading}
                >
                    <Text className="text-white text-sm mt-4">
                        Don't have an account? Sign Up
                    </Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}
