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
    const { loadCurrentUser } = useAuth();
    useEffect(() => {
        const value = Array.isArray(token) ? token[0] : token;
        const errorValue = Array.isArray(error) ? error[0] : error;
        console.log(value);
        const completeAuth = async () => {
            if (errorValue) {
                Alert.alert("Google Sign In Failed", errorValue);
                return;
            }

            if (!value) {
                Alert.alert("Google Sign In Failed", "Missing auth token.");
                return;
            }
            console.log("Token saved:", value);

            try {
                await AsyncStorage.setItem("token", value);
                await new Promise((resolve) => setTimeout(resolve, 500));
                console.log("About to load current user");
                await loadCurrentUser();
                console.log("User loaded successfully");
                await new Promise((resolve) => setTimeout(resolve, 2000));

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
