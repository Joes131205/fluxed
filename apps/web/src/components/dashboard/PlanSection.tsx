import { usePlans } from "@/hooks/usePlan";
import { useEffect, useState } from "react";
import { Button } from "../misc/Button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

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

    console.log(plansData);

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
        <div className="mt-8 rounded-[2rem] border-2 border-border bg-white p-8 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold">Your plan</h3>
            </div>

            {isPlansLoading && (
                <div className="flex flex-col items-center py-12 gap-3">
                    <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-bold text-text/40 uppercase tracking-widest">
                        Loading...
                    </p>
                </div>
            )}

            {!isPlansLoading && planItems.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed border-border rounded-3xl bg-secondary/20">
                    <p className="text-sm font-bold text-text/50">
                        Your plan is empty
                        <br />
                        <span className="text-primary">
                            Get started by rescheduling!
                        </span>
                    </p>
                </div>
            )}

            {!isPlansLoading && planItems.length > 0 && (
                <div className="relative border-l-4 border-secondary/50 space-y-8">
                    {planItems.map((item) => {
                        const startTime = new Date(item.startTime);
                        const endTime = new Date(item.endTime);
                        const isNow = now >= startTime && now <= endTime;
                        const isPassed = now >= endTime;
                        return (
                            <div
                                key={item.sessionId}
                                className="relative group"
                            >
                                <div
                                    className={`
                            relative rounded-2xl p-6 transition-all duration-200
                            border-5
                            ${isNow ? "border-accent" : isPassed ? "border-gray-500" : "border-primary"}
                        `}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-xs font-black uppercase tracking-widest text-text/30">
                                                Area
                                            </p>
                                            <p className="text-xl font-black tracking-tight text-text mb-4">
                                                Area Name
                                            </p>
                                        </div>
                                        <ArrowRight size={30} />
                                        <div className="flex flex-col gap-1">
                                            <p className="text-xs font-black uppercase tracking-widest text-text/30">
                                                Subarea
                                            </p>
                                            <p className="text-xl font-black tracking-tight text-text mb-4">
                                                {item.subareaName}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-text/30">
                                                Start
                                            </p>
                                            <p className="font-mono text-sm font-bold text-text/70">
                                                {formatPlanDateTime(
                                                    item.startTime,
                                                )}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-text/30">
                                                Finish
                                            </p>
                                            <p className="font-mono text-sm font-bold text-text/70">
                                                {formatPlanDateTime(
                                                    item.endTime,
                                                )}
                                            </p>
                                        </div>
                                        {isNow ? (
                                            <div className="ml-auto flex items-center gap-2 text-sm font-black text-accent uppercase px-3 py-1 bg-accent/10 rounded-full">
                                                In Progress
                                            </div>
                                        ) : isPassed ? (
                                            <div className="ml-auto flex items-center gap-2 text-sm font-black text-black uppercase px-3 py-1 bg-gray-500/10 rounded-full">
                                                Passed
                                            </div>
                                        ) : (
                                            <div className="ml-auto flex items-center gap-2 text-sm font-black text-primary uppercase px-3 py-1 bg-primary/10 rounded-full">
                                                Upcoming
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
