import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { useAuth } from "../hooks/useAuth";

export default function AuthSuccess() {
    const router = useRouter();
    const { token, error } = useLocalSearchParams<{
        token?: string | string[];
        error?: string | string[];
    }>();
    const { getCurrentUser } = useAuth();
    useEffect(() => {
        const value = Array.isArray(token) ? token[0] : token;
        const errorValue = Array.isArray(error) ? error[0] : error;
        console.log(
            "Auth success - received token:",
            value?.substring(0, 50) + "...",
        );
        console.log("Auth success - received error:", errorValue);
        const completeAuth = async () => {
            if (errorValue) {
                Alert.alert("Google Sign In Failed", errorValue);
                return;
            }

            if (!value) {
                Alert.alert("Google Sign In Failed", "Missing auth token.");
                return;
            }
            console.log("Token to save:", value?.substring(0, 50) + "...");

            try {
                await AsyncStorage.setItem("token", value);
                const savedToken = await AsyncStorage.getItem("token");
                console.log(
                    "Token saved and verified:",
                    savedToken?.substring(0, 50) + "...",
                );
                await new Promise((resolve) => setTimeout(resolve, 500));
                console.log("About to load current user");
                await getCurrentUser();
                console.log("User loaded successfully");
                await new Promise((resolve) => setTimeout(resolve, 2000));

                Alert.alert("Success", "Successfully logged in using Google!");
                router.replace("/dashboard");
            } catch (err) {
                console.error("Auth error:", err);
                Alert.alert("Error", `Failed to complete auth: ${err}`);
            }
        };

        void completeAuth();
    }, [error, router, token]);

    return (
        <View className="flex-1 items-center justify-center gap-4 px-6">
            <ActivityIndicator />
            <Text className="text-center text-base font-semibold">
                Signing you in...
            </Text>
        </View>
    );
}
