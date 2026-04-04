import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, RefreshCcw, Settings } from "lucide-react";

export const Navbar = () => {
    const location = useLocation();

    const navItems = [
        {
            label: "Overview",
            to: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "Reschedule",
            to: "/dashboard/calendar",
            icon: RefreshCcw,
        },
        {
            label: "Settings",
            to: "/dashboard/settings",
            icon: Settings,
        },
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <nav className="flex items-center gap-2 p-2 bg-white/70 backdrop-blur-xl border-2 border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.to;

                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`group relative border-5 flex items-center justify-center h-14 w-14 transition-all duration-300 ${
                                isActive
                                    ? "border-primary shadow-lg shadow-primary/30"
                                    : "text-foreground/40 hover:bg-secondary/50 hover:text-primary"
                            }`}
                        >
                            <Icon className="h-6 w-6 transition-transform" />
                            <span className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all bg-foreground text-background text-[10px] font-black uppercase tracking-widest px-3 py-1.5">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};
