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

    useEffect(() => {
        const checkAuth = async () => {
            setIsAuthLoading(true);
            const token = await AsyncStorage.getItem("token");
            if (token) {
                try {
                    const response = await authClient.me.$get(
                        {},
                        {
                            headers: getAuthHeaders,
                        },
                    );
                    if (response.ok) {
                        const data = await response.json();
                        setUser(data.user);
                    } else if (response.status === 401) {
                        AsyncStorage.clear();
                    }
                } catch (error) {
                    console.error(error);
                    AsyncStorage.clear();
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
            const data = await response.json();
            AsyncStorage.setItem("token", data.token);
            setUser(data.user);
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
            const data = await response.json();
            AsyncStorage.setItem("token", data.token);
            setUser(data.user);
        } else {
            throw new Error("Signup failed");
        }
    };

    const logout = async () => {
        AsyncStorage.clear();
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
