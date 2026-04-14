import "../global.css";

import { Slot, useRouter } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { Navbar } from "../components/ui/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { ActivityIndicator, Text, View } from "react-native";
import { useEffect } from "react";

const queryClient = new QueryClient();

function RootLayoutContent() {
    const { isAuthenticated, isAuthLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthLoading && !isAuthenticated) {
            router.replace("/sign-in");
        }
    }, [isAuthenticated, isAuthLoading, router]);

    if (isAuthLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-background flex flex-col gap-5">
                <ActivityIndicator size={32} />
                <Text className="text-center font-bold text-xl">
                    Loading...
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1">
            <View className="flex-1">
                <Slot />
            </View>
            <Navbar />
        </View>
    );
}

export default function Layout() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <RootLayoutContent />
            </AuthProvider>
        </QueryClientProvider>
    );
}
