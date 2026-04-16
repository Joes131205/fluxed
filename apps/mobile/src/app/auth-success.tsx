import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";

export default function AuthSuccess() {
    const router = useRouter();
    const { token, error } = useLocalSearchParams<{
        token?: string | string[];
        error?: string | string[];
    }>();

    useEffect(() => {
        const value = Array.isArray(token) ? token[0] : token;
        const errorValue = Array.isArray(error) ? error[0] : error;

        const completeAuth = async () => {
            if (errorValue) {
                Alert.alert("Google Sign In Failed", errorValue);
                router.replace("/sign-in");
                return;
            }

            if (!value) {
                Alert.alert("Google Sign In Failed", "Missing auth token.");
                router.replace("/sign-in");
                return;
            }

            await AsyncStorage.setItem("token", value);
            router.replace("/dashboard");
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
