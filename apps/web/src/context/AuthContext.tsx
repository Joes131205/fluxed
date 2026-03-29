import { authClient } from "@/lib/client";
import { createContext, useEffect, useState } from "react";
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
    refreshUser: () => Promise<void>;
    isAuthLoading: boolean;
};

type User = {
    id: string;
    createdAt: string;
    updatedAt: string;
    email: string;
    username: string;
    googleRefreshToken: string | null;
    googleId: string | null;
    startTime: string;
    endTime: string;
    minDuration: number | null;
    timeBuffer: number | null;
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
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const authResponse = await authClient.me.$get(
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        },
                    );
                    if (authResponse.ok) {
                        const data = await authResponse.json();

                        setUser(data.user);
                    } else if (authResponse.status === 401) {
                        localStorage.clear();
                    }
                } catch (error) {
                    console.error(error);
                    localStorage.clear();
                }
            }
            setIsAuthLoading(false);
        };
        checkAuth();
    }, []);

    const refreshUser = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data.user);
    };

    const login = async (email: string, password: string) => {
        const response = await authClient.login.$post({
            json: { email, password },
        });

        console.log(response);

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.token);
            await refreshUser();
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
            localStorage.setItem("token", data.token);
            await refreshUser();
        } else {
            throw new Error("Signup failed");
        }
    };

    const logout = async () => {
        localStorage.clear();
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
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
