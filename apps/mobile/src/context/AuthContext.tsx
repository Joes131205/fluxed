import { User } from "../../../packages/shared/src/types";
import { getAuthHeaders } from "../lib/authHeaders";
import { authClient } from "../lib/client";
import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    isAuthLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined,
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    const loadCurrentUser = async () => {
        const headers = await getAuthHeaders();
        const response = await authClient.me.$get(
            {},
            {
                headers,
            },
        );

        if (!response.ok) {
            throw new Error("Unable to fetch current user");
        }

        const data = (await response.json()) as { user: User };
        setUser(data.user);
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
        await AsyncStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                signup,
                logout,
                isAuthLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
