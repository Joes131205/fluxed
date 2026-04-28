import { User } from "../../../packages/shared/src/types";
import { getMe } from "../utils/getMe";
import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { authClient } from "../lib/client";

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
    loadCurrentUser: () => Promise<void>;
    isAuthLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined,
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const router = useRouter();

    const loadCurrentUser = async () => {
        try {
            const data = await getMe();
            console.log(data);
            if (!data || !data.user) {
                throw new Error("Unable to fetch current user");
            }
            setUser(data.user);
        } catch (error) {
            console.error("loadCurrentUser error:", error);
            throw error;
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            setIsAuthLoading(true);
            const token = await AsyncStorage.getItem("token");
            if (token) {
                try {
                    await loadCurrentUser();
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
            await loadCurrentUser();
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
            await loadCurrentUser();
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
                    router.replace("/sign-in");
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
                loadCurrentUser,
                isAuthLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
