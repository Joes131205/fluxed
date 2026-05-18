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
        const response = await fetch(`${API_URL}/auth/me`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("fetchCurrentUser status:", response.status);

        if (!response.ok) {
            const body = await response.text();
            console.log("fetchCurrentUser non-ok body:", body);
            return null;
        }

        const data = (await response.json()) as {
            ok?: boolean;
            user?: User;
            error?: string;
        };

        console.log("fetchCurrentUser data:", data);

        return data.user ?? null;
    } catch (error) {
        console.error("fetchCurrentUser error:", error);
        return null;
    }
};

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (
        username: string,
        email: string,
        password: string,
    ) => Promise<void>;
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

    const login = async (email: string, password: string) => {
        const response = await authClient.login.$post({
            json: { email, password },
        });

        if (response.ok) {
            const data = (await response.json()) as { token?: string };
            if (!data.token) {
                throw new Error("Login failed: token missing");
            }
            await AsyncStorage.setItem("token", data.token);
            const currentUser = await getCurrentUser();
            if (!currentUser) {
                throw new Error("Login succeeded, but loading the user failed");
            }
        } else {
            throw new Error("Login failed");
        }
    };

    const signup = async (
        username: string,
        email: string,
        password: string,
    ) => {
        const response = await authClient.register.$post({
            json: { username, email, password },
        });
        if (response.ok) {
            const data = (await response.json()) as { token?: string };
            if (!data.token) {
                throw new Error("Signup failed: token missing");
            }
            await AsyncStorage.setItem("token", data.token);
            const currentUser = await getCurrentUser();
            if (!currentUser) {
                throw new Error(
                    "Signup succeeded, but loading the user failed",
                );
            }
        } else {
            throw new Error("Signup failed");
        }
    };

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
                login,
                signup,
                logout,
                getCurrentUser,
                isAuthLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
