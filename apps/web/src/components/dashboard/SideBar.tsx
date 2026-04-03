import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Menu, RefreshCcw, Settings, X } from "lucide-react";
import { useState } from "react";

export const SideBar = () => {
    const [isOpened, setIsOpened] = useState(false);

    const navItems = [
        {
            label: "Overview",
            to: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "Reschedule",
            to: "/dashboard/reschedule",
            icon: RefreshCcw,
        },
        {
            label: "Settings",
            to: "/dashboard/settings",
            icon: Settings,
        },
    ] as const;

    return (
        <>
            <div className="sticky top-0 z-30 border-b border-foreground/10 bg-background px-4 py-3 md:hidden">
                <button
                    type="button"
                    onClick={() => setIsOpened(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-foreground/15 px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-neutral-100"
                    aria-label="Open sidebar"
                >
                    <Menu className="h-4 w-4" />
                    <span>Menu</span>
                </button>
            </div>

            <aside
                className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-foreground/10 bg-background px-4 py-5 transition-transform duration-200 ease-out md:static md:translate-x-0 ${
                    isOpened ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {isOpened && (
                    <button
                        type="button"
                        className="fixed inset-0 z-30 bg-black/30 md:hidden"
                        onClick={() => setIsOpened(false)}
                        aria-label="Close sidebar backdrop"
                    />
                )}
                <div className="flex h-full flex-col">
                    <div className="mb-5 flex items-center justify-between md:hidden">
                        <span className="text-sm font-bold tracking-wide text-foreground/80">
                            Navigation
                        </span>
                        <button
                            type="button"
                            onClick={() => setIsOpened(false)}
                            className="rounded-lg border border-foreground/15 p-2 text-foreground transition hover:bg-neutral-100"
                            aria-label="Close sidebar"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <nav className="space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    onClick={() => setIsOpened(false)}
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground/80 transition hover:bg-neutral-100 hover:text-foreground"
                                    activeProps={{
                                        className:
                                            "flex items-center gap-3 rounded-xl bg-primary/15 px-3 py-2.5 text-sm font-semibold text-foreground",
                                    }}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>
        </>
    );
};
