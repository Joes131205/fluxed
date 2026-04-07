import "../global.css";

import { Slot } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { Navbar } from "../components/ui/Navbar";

export default function Layout() {
    return (
        <AuthProvider>
            <Slot />
            <Navbar />
        </AuthProvider>
    );
}
