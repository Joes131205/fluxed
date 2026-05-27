import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Text,
    View,
    Pressable,
    Alert,
    Linking,
    ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authClient } from "../lib/client";
import { API_URL } from "../lib/env";
import { useAuth } from "../hooks/useAuth";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { GoogleAuthButton } from "../components/ui/GoogleAuthButton";
import { TextPrimaryInput } from "../components/ui/TextPrimaryInput";

export default function SignUp() {
    const { user, getCurrentUser } = useAuth();

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
            const response = await authClient.register(
                email,
                password,
                username,
            );

            if (!response.ok || !response.token) {
                Alert.alert(
                    "Sign Up Failed",
                    response.error || "Unknown error",
                );
                return;
            }

            await AsyncStorage.setItem("token", response.token);
            await getCurrentUser();
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
        <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName="px-5 pt-10 pb-32"
        >
            <View className="flex flex-col items-center justify-center flex-1 gap-4 px-6">
                <Text className="text-3xl font-bold mb-6">Create Account</Text>

                <TextPrimaryInput
                    label="Username"
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Username"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                />

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
                    textContentType="newPassword"
                    editable={!loading}
                />

                <TextPrimaryInput
                    label="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm Password"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="newPassword"
                    editable={!loading}
                />

                <PrimaryButton
                    label="Sign Up"
                    onPress={handleSignUp}
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
                    onPress={() => router.push("/sign-in")}
                    disabled={loading}
                >
                    <Text className="text-white text-sm mt-4">
                        Already have an account? Sign In
                    </Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}
