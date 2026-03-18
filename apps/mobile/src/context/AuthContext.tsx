import { client } from "../lib/client";
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
            setUser({ id: data.id, email: data.email, username });
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
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
