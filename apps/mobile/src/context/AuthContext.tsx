import { User } from "../../../packages/shared/src/types";
import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { API_URL } from "../lib/env";
import { authClient } from "../lib/client";

export const fetchCurrentUser = async () => {
    const token = await AsyncStorage.getItem("token");
    console.log("Retrieved token from storage:", token + "...");

    if (!token) {
        return null;
    }

    try {
        const response = await authClient.getMe(token);
        console.log(response);
        console.log("fetchCurrentUser status:", response.ok);

        if (!response.ok) {
            const body = await response.text();
            console.log("fetchCurrentUser non-ok body:", body);
            return null;
        }

        console.log("fetchCurrentUser data:", response.user);

        return response.user ?? null;
    } catch (error) {
        console.error("fetchCurrentUser error:", error);
        return null;
    }
};

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    logout: () => Promise<void>;
    getCurrentUser: () => Promise<User | null>;
    isAuthLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined,
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const router = useRouter();

    const getCurrentUser = async () => {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
        if (!currentUser) {
            setUser(null);
        }

        return currentUser;
    };

    useEffect(() => {
        const checkAuth = async () => {
            setIsAuthLoading(true);
            const token = await AsyncStorage.getItem("token");
            if (token) {
                try {
                    await getCurrentUser();
                } catch (error) {
                    console.error(error);
                    await AsyncStorage.clear();
                }
            }
            setIsAuthLoading(false);
        };
        checkAuth();
    }, []);

    const logout = async () => {
        Alert.alert("Logout", "Are you sure you want to log out?", [
            {
                text: "No!",
                style: "cancel",
            },
            {
                text: "Yuh!",
                onPress: async () => {
                    await AsyncStorage.clear();
                    setUser(null);
                    router.replace("/");
                },
            },
        ]);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                logout,
                getCurrentUser,
                isAuthLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
