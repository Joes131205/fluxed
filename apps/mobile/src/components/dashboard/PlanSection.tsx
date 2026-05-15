import { ActivityIndicator, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { usePlans } from "../../hooks/usePlans";

// Note: Removed ArrowRight as we will stack the times for a cleaner "ticket" look
// matching the structured data in the reference images.

type PlanItem = {
    sessionId: string;
    startTime: string;
    endTime: string;
    minutes: number;
    subareaId: string;
    subareaName: string;
    subareaWeight: number | null;
    areaName: string;
};

export const PlanSection = () => {
    const { data: plansData, isLoading: isPlansLoading } = usePlans();

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

    const formatTimeOnly = (value: string) => {
        return new Date(value).toLocaleDateString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    return (
        <View className="p-5">
            <View className="mb-6">
                <Text
                    className="text-xl text-white tracking-widest font-bold"
                    style={{ fontFamily: "PressStart2P_400Regular" }}
                >
                    Your Plan Timeline
                </Text>
            </View>

            {isPlansLoading && (
                <View className="py-10">
                    <Text
                        className="mt-4 text-center text-sm text-white uppercase tracking-widest"
                        style={{ fontFamily: "PressStart2P_400Regular" }}
                    >
                        Fetching...
                    </Text>
                </View>
            )}

            {!isPlansLoading && planItems.length === 0 && (
                <View className="py-10 border-2 border-dashed border-white/30 items-center justify-center">
                    <Text
                        className="text-center text-lg text-white mb-2"
                        style={{ fontFamily: "PressStart2P_400Regular" }}
                    >
                        Empty State
                    </Text>
                    <Text className="text-white/60 font-bold uppercase text-xs tracking-widest">
                        Reschedule to generate plan
                    </Text>
                </View>
            )}

            {!isPlansLoading && planItems.length > 0 && (
                <View className="flex flex-col gap-4">
                    {planItems.map((item, idx) => {
                        const startTime = new Date(item.startTime);
                        const endTime = new Date(item.endTime);
                        const isNow = now >= startTime && now <= endTime;
                        const isPassed = now >= endTime;

                        let cardStyle =
                            "p-5 border-2 flex-row justify-between items-center ";
                        let textMainColor = "";
                        let textSubColor = "";

                        if (isNow) {
                            cardStyle += "bg-white border-white shadow-lg";
                            textMainColor = "text-black";
                            textSubColor = "text-black/60";
                        } else if (isPassed) {
                            cardStyle +=
                                "bg-transparent border-white/30 border-dashed";
                            textMainColor = "text-white/40";
                            textSubColor = "text-white/30";
                        } else {
                            cardStyle += "bg-transparent border-white";
                            textMainColor = "text-white";
                            textSubColor = "text-white/60";
                        }

                        return (
                            <View key={idx}>
                                <View
                                    key={item.sessionId}
                                    className={cardStyle}
                                >
                                    <View className="flex-1 pr-4">
                                        <Text
                                            className={`text-xs font-black uppercase tracking-widest mb-2 ${textSubColor}`}
                                        >
                                            {item.areaName}
                                        </Text>
                                        <Text
                                            className={`text-sm leading-6 ${textMainColor}`}
                                            style={{
                                                fontFamily:
                                                    "PressStart2P_400Regular",
                                            }}
                                            numberOfLines={2}
                                        >
                                            {item.subareaName}
                                        </Text>
                                    </View>

                                    <View
                                        className="items-end border-l-2 border-current pl-4"
                                        style={{
                                            borderColor: isNow
                                                ? "rgba(0,0,0,0.1)"
                                                : "rgba(255,255,255,0.1)",
                                        }}
                                    >
                                        <Text
                                            className={`font-mono text-sm font-black ${textMainColor}`}
                                        >
                                            {formatTimeOnly(item.startTime)}
                                        </Text>
                                        <Text
                                            className={`font-mono text-xs font-bold mt-1 ${textSubColor}`}
                                        >
                                            {formatTimeOnly(item.endTime)}
                                        </Text>
                                        <Text
                                            className={`text-[10px] font-black uppercase mt-2 tracking-widest ${textMainColor}`}
                                        >
                                            {item.minutes} MIN
                                        </Text>
                                    </View>
                                </View>
                                {idx !== planItems.length - 1 ? (
                                    <Text className="text-center w-full mt-3 text-white/30">
                                        |
                                    </Text>
                                ) : (
                                    ""
                                )}
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    );
};
