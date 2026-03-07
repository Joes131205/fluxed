import { client } from "@/lib/client";
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
    isAuthLoading: boolean;
};

type User = {
    id: string;
    email: string;
    username?: string;
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
                    const response = await client.api.auth.me.$get(
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        },
                    );
                    if (response.ok) {
                        const data = await response.json();
                        setUser({
                            id: data.id,
                            email: data.email,
                            username: data.username,
                        });
                    } else if (response.status === 401) {
                        const refreshToken =
                            localStorage.getItem("refreshToken");
                        if (refreshToken) {
                            try {
                                const refreshResponse =
                                    await client.api.auth.refresh.$post(
                                        {},
                                        {
                                            headers: {
                                                Authorization: `Bearer ${refreshToken}`,
                                            },
                                        },
                                    );
                                if (refreshResponse.ok) {
                                    const refreshData =
                                        await refreshResponse.json();
                                    localStorage.setItem(
                                        "token",
                                        refreshData.token,
                                    );
                                    const retryResponse =
                                        await client.api.auth.me.$get(
                                            {},
                                            {
                                                headers: {
                                                    Authorization: `Bearer ${refreshData.token}`,
                                                },
                                            },
                                        );
                                    if (retryResponse.ok) {
                                        const userData =
                                            await retryResponse.json();
                                        setUser({
                                            id: userData.id,
                                            email: userData.email,
                                            username: userData.username,
                                        });
                                        setIsAuthLoading(false);
                                        return;
                                    }
                                }
                            } catch (refreshError) {
                                console.error(refreshError);
                            }
                        }
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

    const login = async (email: string, password: string) => {
        const response = await client.api.auth.login.$post({
            json: { email, password },
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("refreshToken", data.refreshToken);
            setUser({
                id: data.id,
                email: data.email,
                username: data.username,
            });
        } else {
            throw new Error("Login failed");
        }
    };

    const signup = async (
        username: string,
        email: string,
        password: string,
    ) => {
        const response = await client.api.auth.register.$post({
            json: { username, email, password },
        });
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("refreshToken", data.refreshToken);
            setUser({ id: data.id, email: data.email, username });
        } else {
            throw new Error("Signup failed");
        }
    };

    const logout = async () => {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
            await client.api.auth.revoke.$post(
                {},
                {
                    headers: { Authorization: `Bearer ${refreshToken}` },
                },
            );
        }
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
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
