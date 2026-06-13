import "../global.css";

import { Slot, usePathname, useRouter } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { Navbar } from "../components/ui/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { Text, View } from "react-native";
import { useEffect } from "react";
import { Onboarding } from "./dashboard/onboarding";
import { useUniwind } from "uniwind";

const queryClient = new QueryClient();

function RootLayoutContent() {
    const { isAuthenticated, isAuthLoading } = useAuth();
    const { user } = useAuth();
    const { theme } = useUniwind();
    const router = useRouter();
    const pathname = usePathname();

    const publicRoutes = new Set([
        "/",
        "/sign-in",
        "/sign-up",
        "/auth-success",
    ]);

    useEffect(() => {
        if (!isAuthLoading && !isAuthenticated && !publicRoutes.has(pathname)) {
            router.replace("/sign-in");
        }
    }, [isAuthenticated, isAuthLoading, pathname, router]);

    if (isAuthLoading) {
        return (
            <View
                className={`flex-1 items-center justify-center bg-background flex flex-col gap-5 ${theme === "dark" ? "dark" : ""}`}
            >
                <Text className="text-center font-bold text-xl text-primary font-mono uppercase tracking-widest">
                    Loading data...
                </Text>
            </View>
        );
    }

    return (
        <View
            className={`flex-1 bg-background ${theme === "dark" ? "dark" : ""}`}
        >
            <View className="flex-1 pt-2">
                {user ? <Onboarding /> : ""}
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
