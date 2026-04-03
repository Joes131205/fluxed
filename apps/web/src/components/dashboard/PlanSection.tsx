import { usePlans } from "@/hooks/usePlan";
import { useEffect, useState } from "react";

type PlanItem = {
    sessionId: string;
    startTime: string;
    endTime: string;
    minutes: number;
    subareaId: string;
    subareaName: string;
    subareaWeight: number | null;
};

export const PlanSection = () => {
    const {
        data: plansData,
        isLoading: isPlansLoading,
        error: plansError,
    } = usePlans();

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

    return (
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900">Your Plan</h3>

            {isPlansLoading && (
                <p className="mt-3 text-sm text-gray-600">Loading plan...</p>
            )}

            {plansError && (
                <p className="mt-3 text-sm text-red-600">
                    Could not load your plan.
                </p>
            )}

            {!isPlansLoading && !plansError && planItems.length === 0 && (
                <p className="mt-3 text-sm text-gray-600">
                    No planned sessions yet. Create one from Calendar +
                    Reschedule.
                </p>
            )}

            {!isPlansLoading && !plansError && planItems.length > 0 && (
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
                                {formatPlanDateTime(item.startTime)} -{" "}
                                {formatPlanDateTime(item.endTime)}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                Weight: {item.subareaWeight ?? 0}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
