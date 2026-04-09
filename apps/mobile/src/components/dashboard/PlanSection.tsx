import { Text, View } from "react-native";
import { usePlans } from "../../hooks/usePlans";
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
        <View className="mt-8 relative overflow-hidden">
            <View className="flex items-center justify-between mb-8">
                <Text className="text-2xl font-bold">Your plan</Text>
            </View>

            {isPlansLoading && (
                <View className="flex flex-col items-center py-12 gap-3">
                    <Text className="text-xs font-bold text-text/40 uppercase tracking-widest">
                        Loading...
                    </Text>
                </View>
            )}

            {!isPlansLoading && planItems.length === 0 && (
                <View className="text-center py-16 border-2 border-dashed border-border rounded-3xl bg-secondary/20">
                    <Text className="text-sm font-bold text-text/50">
                        Your plan is empty
                    </Text>
                    <Text className="text-primary">
                        Get started by rescheduling!
                    </Text>
                </View>
            )}

            {!isPlansLoading && planItems.length > 0 && (
                <View className="flex flex-col gap-5">
                    {planItems.map((item) => {
                        const startTime = new Date(item.startTime);
                        const endTime = new Date(item.endTime);
                        const isNow = now >= startTime && now <= endTime;
                        const isPassed = now >= endTime;
                        return (
                            <View
                                key={item.sessionId}
                                className={`bg-white rounded-md border-l-4 *:relative group ${isNow ? "border-accent" : isPassed ? "border-gray-500" : "border-primary"}`}
                            >
                                <View
                                    className={`relative rounded-2xl p-6 transition-all duration-200 `}
                                >
                                    <View className="flex flex-row items-center gap-5">
                                        <View className="flex flex-col gap-1">
                                            <Text className="text-xs font-black uppercase tracking-widest text-text/30">
                                                Area
                                            </Text>
                                            <Text className="text-xl font-black tracking-tight text-text mb-4">
                                                Area Name
                                            </Text>
                                        </View>

                                        <View className="flex flex-col gap-1">
                                            <Text className="text-xs font-black uppercase tracking-widest text-text/30">
                                                Subarea
                                            </Text>
                                            <Text className="text-xl font-black tracking-tight text-text mb-4">
                                                {item.subareaName}
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="flex flex-row items-center gap-8">
                                        <View className="space-y-1">
                                            <Text className="text-[9px] font-black uppercase tracking-widest text-text/30">
                                                Start
                                            </Text>
                                            <Text className="font-mono text-sm font-bold text-text/70">
                                                {formatPlanDateTime(
                                                    item.startTime,
                                                )}
                                            </Text>
                                        </View>
                                        <View className="space-y-1">
                                            <Text className="text-[9px] font-black uppercase tracking-widest text-text/30">
                                                Finish
                                            </Text>
                                            <Text className="font-mono text-sm font-bold text-text/70">
                                                {formatPlanDateTime(
                                                    item.endTime,
                                                )}
                                            </Text>
                                        </View>
                                        {isNow ? (
                                            <View className="hidden md:flex ml-auto items-center gap-2 text-sm font-black text-accent uppercase px-3 py-1 bg-accent/10 rounded-full">
                                                <Text>In Progress</Text>
                                            </View>
                                        ) : isPassed ? (
                                            <View className="hidden md:flex ml-auto items-center gap-2 text-sm font-black text-black uppercase px-3 py-1 bg-gray-500/10 rounded-full">
                                                <Text>Passed</Text>
                                            </View>
                                        ) : (
                                            <View className="hidden md:flex ml-auto items-center gap-2 text-sm font-black text-primary uppercase px-3 py-1 bg-primary/10 rounded-full">
                                                <Text>Upcoming</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    );
};
