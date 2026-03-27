import AreaList from "@/components/area/AreaList";
import { useAreas } from "@/hooks/useAreas";
import { useAuth } from "@/hooks/useAuth";
import { usePlans } from "@/hooks/usePlan";
import { requireAuth } from "@/utils/requireAuth";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/dashboard/")({
    beforeLoad: requireAuth,
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { data: areasData, isLoading, error } = useAreas();
    const {
        data: plansData,
        isLoading: isPlansLoading,
        error: plansError,
    } = usePlans();

    type PlanItem = {
        sessionId: string;
        startTime: string;
        endTime: string;
        minutes: number;
        subareaId: string;
        subareaName: string;
        subareaWeight: number | null;
    };

    const planItems: PlanItem[] =
        plansData &&
        typeof plansData === "object" &&
        plansData !== null &&
        "ok" in plansData &&
        (plansData as { ok?: boolean }).ok &&
        "data" in plansData &&
        Array.isArray((plansData as { data?: unknown }).data)
            ? ((plansData as { data: PlanItem[] }).data ?? [])
            : [];

    const [now, setNow] = useState(new Date());

    const formatPlanDateTime = (value: string) => {
        return new Date(value).toLocaleString([], {
            hour: "2-digit",
            minute: "2-digit",
            month: "short",
            day: "numeric",
        });
    };

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const unsubscribe = async () => {
            if (window.Notification) {
                if (
                    window.Notification.permission !== "granted" &&
                    window.Notification.permission !== "denied"
                ) {
                    const req = await window.Notification.requestPermission();
                    if (req === "granted") {
                        new Notification("Beep!", {
                            body: "Boop! This will be used on this page!",
                        });
                    }
                } else if (window.Notification.permission === "granted") {
                    if (planItems.length) {
                        for (let i = 0; i < planItems.length; i++) {
                            if (
                                now >= new Date(planItems[i].startTime) &&
                                now <= new Date(planItems[i].endTime)
                            ) {
                                await new Notification("You have a task!", {
                                    body: `${planItems[i].subareaName} at ${new Date(planItems[i].startTime).toLocaleTimeString()} - ${new Date(planItems[i].endTime).toLocaleTimeString()}`,
                                });
                            }
                        }
                    }
                }
            }
        };
        unsubscribe();
    }, []);
    if (isLoading) {
        return <p>Loading...</p>;
    }
    if (error) {
        console.log(error);
        return <p>Error!</p>;
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">
                            Hello World!
                        </h1>
                    </div>
                    <button
                        onClick={() => {
                            logout();
                            navigate({ to: "/sign-in" });
                        }}
                        className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                    >
                        Logout
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">
                            Username
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">
                            {user?.username || "N/A"}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">
                            Email
                        </p>
                        <p className="text-lg font-semibold text-gray-900 mt-2 break-all">
                            {user?.email}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">
                            User ID
                        </p>
                        <p className="text-sm font-mono text-gray-900 mt-2 break-all">
                            {user?.id}
                        </p>
                    </div>
                </div>
                <div>
                    <p>Google Log In?</p>
                    {user?.googleId ? <p>True</p> : <p>False</p>}
                </div>
                <div>
                    <Link to="/dashboard/settings">Settings</Link>
                </div>
                <div className="mt-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Your Areas
                        </h2>
                        <Link
                            to="/dashboard/areas/create"
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                        >
                            Create Area
                        </Link>
                        <Link
                            to="/dashboard/subareas/create"
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                        >
                            Create subarea
                        </Link>
                        <Link
                            to="/dashboard/calendar"
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                        >
                            Calendar + Reschedule
                        </Link>
                    </div>

                    {isLoading && (
                        <p className="text-gray-600">Loading areas...</p>
                    )}
                    {error && (
                        <p className="text-red-600">
                            Error:{" "}
                            {typeof error === "object" &&
                            error !== null &&
                            "message" in error
                                ? (error as { message: string }).message
                                : String(error)}
                        </p>
                    )}

                    <AreaList
                        areas={
                            areasData && areasData.ok
                                ? areasData.data.map((area) => ({
                                      ...area,
                                      created_at: new Date(area.created_at),
                                      updated_at: new Date(area.updated_at),
                                  }))
                                : []
                        }
                    />

                    <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900">
                            Your Plan
                        </h3>

                        {isPlansLoading && (
                            <p className="mt-3 text-sm text-gray-600">
                                Loading plan...
                            </p>
                        )}

                        {plansError && (
                            <p className="mt-3 text-sm text-red-600">
                                Could not load your plan.
                            </p>
                        )}

                        {!isPlansLoading &&
                            !plansError &&
                            planItems.length === 0 && (
                                <p className="mt-3 text-sm text-gray-600">
                                    No planned sessions yet. Create one from
                                    Calendar + Reschedule.
                                </p>
                            )}

                        {!isPlansLoading &&
                            !plansError &&
                            planItems.length > 0 && (
                                <ul className="mt-4 space-y-3">
                                    {planItems.map((item) => (
                                        <li
                                            key={item.sessionId}
                                            className={`rounded-md border border-gray-200 bg-gray-50 p-4 ${now >= new Date(item.startTime) && now <= new Date(item.endTime) ? "border-green-500 border-4" : ""}`}
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <p className="font-semibold text-gray-900">
                                                    {item.subareaName}
                                                </p>
                                                <p className="text-sm font-medium text-blue-700">
                                                    {item.minutes} min
                                                </p>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-700">
                                                {formatPlanDateTime(
                                                    item.startTime,
                                                )}{" "}
                                                -{" "}
                                                {formatPlanDateTime(
                                                    item.endTime,
                                                )}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                Weight:{" "}
                                                {item.subareaWeight ?? 0}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}
