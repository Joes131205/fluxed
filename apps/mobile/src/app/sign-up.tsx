import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Text, View, Pressable, Alert, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authClient } from "../lib/client";
import { API_URL } from "../lib/env";
import { useAuth } from "../hooks/useAuth";
import * as WebBrowser from "expo-web-browser";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { GoogleAuthButton } from "../components/ui/GoogleAuthButton";
import { TextPrimaryInput } from "../components/ui/TextPrimaryInput";

WebBrowser.maybeCompleteAuthSession();

export default function SignUp() {
    const { user, getCurrentUser } = useAuth();
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            router.replace("/dashboard");
        }
    }, [router, user]);

    const handleSignUp = async () => {
        if (!username || !email || !password || !confirmPassword) {
            Alert.alert("Input Required", "Please fill in all fields");
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
            await getCurrentUser();
            router.push("/dashboard");
        } catch (error) {
            Alert.alert(
                "Connection Error",
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

            if (result.type !== "success" || !result.url) return;

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
            contentContainerClassName="px-6 pt-16 pb-32"
        >
            <View className="border-2 border-primary bg-background relative p-5 pt-8">
                <Text className="font-mono text-primary text-xl font-bold mb-6">
                    Create Account
                </Text>

                <TextPrimaryInput
                    label="Username"
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter Username..."
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                />

                <TextPrimaryInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter Email..."
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                />

                <TextPrimaryInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter Password..."
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="newPassword"
                    editable={!loading}
                />

                <TextPrimaryInput
                    label="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm Password..."
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="newPassword"
                    editable={!loading}
                />

                <View className="mt-2">
                    <PrimaryButton
                        label="Register"
                        onPress={handleSignUp}
                        loading={loading}
                    />
                </View>

                <View className="flex-row items-center my-6">
                    <View className="flex-1 h-px border-b border-dashed border-muted-foreground/30" />
                    <Text className="px-4 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                        OR
                    </Text>
                    <View className="flex-1 h-px border-b border-dashed border-muted-foreground/30" />
                </View>

                <GoogleAuthButton
                    onPress={handleGoogleSignIn}
                    loading={loading}
                />
            </View>

            <Pressable
                onPress={() => router.push("/sign-in")}
                disabled={loading}
                className="mt-8 items-start"
            >
                <Text className="text-muted-foreground font-mono uppercase tracking-widest text-xs underline decoration-muted-foreground underline-offset-4 hover:text-primary">
                    Already Have an Account? Sign In
                </Text>
            </Pressable>
        </ScrollView>
    );
}
