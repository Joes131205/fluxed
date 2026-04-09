import "../global.css";

import { Slot } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { Navbar } from "../components/ui/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
export default function Layout() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Slot />
                {/* <Navbar /> */}
            </AuthProvider>
        </QueryClientProvider>
    );
}
