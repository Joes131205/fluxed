import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { usePlans } from "../../hooks/usePlans";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";

type PlanItem = {
    id: string;
    sessionId: string;
    startTime: string;
    endTime: string;
    minutes: number;
    subareaId: string;
    subareaName: string;
    subareaWeight: number | null;
    areaName: string;
    subareaColor: string;
    areaColor: string;
};

export const PlanSection = () => {
    const { data: plansData, isLoading: isPlansLoading } = usePlans();
    const [length, setLength] = useState(0);
    const [progress, setProgress] = useState<string[]>([]);
    const [now, setNow] = useState(new Date());

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

    const DEFAULT_COLOR = "#00ff41";

    const hexToRgba = (hex?: string, alpha = 1) => {
        const fallback = DEFAULT_COLOR.replace(/^#+/, "").slice(0, 6);
        const candidate = (hex ?? "").trim().replace(/^#+/, "").slice(0, 6);
        const raw = /^[0-9a-fA-F]{6}$/.test(candidate) ? candidate : fallback;
        const num = parseInt(raw, 16);
        const r = (num >> 16) & 255;
        const g = (num >> 8) & 255;
        const b = num & 255;
        return `rgba(${r},${g},${b},${alpha})`;
    };

    const formatDateTime = (value: string) => {
        return new Date(value).toLocaleDateString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    const toggleEventCompletion = (id: string) => {
        if (progress.includes(id)) {
            setProgress(progress.filter((item) => item !== id));
        } else {
            setProgress((prev) => [...prev, id]);
        }
    };

    useEffect(() => {
        const loadProgress = async () => {
            setLength(planItems.length);
            const data = await AsyncStorage.getItem("progress");
            if (!data) {
                return;
            }
            const decoded = JSON.parse(data);
            setProgress(decoded);
        };
        loadProgress();
    }, [planItems.length]);

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    return (
        <View className="flex flex-col gap-5 pb-10">
            <View className="border-b border-muted pb-2 mb-2">
                <Text className="text-sm text-primary uppercase tracking-widest font-bold">
                    Schedule
                </Text>
            </View>

            <View className="mb-4">
                <View className="flex-row justify-between items-end mb-2">
                    <Text className="text-white/50 font-bold text-[10px] uppercase tracking-widest">
                        Timeline Progress
                    </Text>
                    <Text className="text-primary text-xs font-mono font-bold">
                        [{progress.length}/{length}]
                    </Text>
                </View>
                <View className="w-full h-4 bg-background border border-white p-[2px]">
                    <View
                        className="h-full bg-primary transition-all duration-500 shadow-[0_0_8px_rgba(0,255,65,0.8)]"
                        style={{
                            width: `${length > 0 ? (progress.length / length) * 100 : 0}%`,
                        }}
                    />
                </View>
            </View>

            {isPlansLoading && (
                <View className="py-10 border border-primary/30 items-center justify-center">
                    <ActivityIndicator size="small" color="#00ff41" />
                    <Text className="mt-4 text-center text-xs text-primary uppercase tracking-widest font-mono">
                        Fetching Schedule...
                    </Text>
                </View>
            )}

            {!isPlansLoading && planItems.length === 0 && (
                <View className="py-10 border-2 border-dashed border-muted-foreground/50 items-center justify-center bg-card">
                    <Ionicons
                        name="terminal-outline"
                        size={32}
                        color="#3a6b3a"
                    />
                    <Text className="text-center text-sm text-muted-foreground mt-4 font-bold tracking-widest uppercase">
                        Timeline Empty
                    </Text>
                    <Text className="text-primary/60 font-mono text-xs mt-2">
                        When you are ready, reschedule!
                    </Text>
                </View>
            )}

            {!isPlansLoading && planItems.length > 0 && (
                <View className="flex flex-col gap-2">
                    {planItems.map((item, idx) => {
                        const isCompleted = progress.includes(item.id);
                        const startTime = new Date(item.startTime);
                        const endTime = new Date(item.endTime);
                        const isNow = now >= startTime && now <= endTime;
                        const isPassed = now >= endTime;
                        const hasNotStarted = !isNow && !isPassed;

                        let cardStyle = "p-4 border ";
                        let textMainColor = "text-white";
                        let textSubColor = "text-white/50";
                        let glowEffect = "";

                        if (isCompleted) {
                            cardStyle += "border-white/10 bg-white/5";
                            textMainColor = "text-white/30 line-through";
                            textSubColor = "text-white/20 line-through";
                        } else if (isNow) {
                            cardStyle += "border-primary bg-primary/10";
                            glowEffect = "shadow-[0_0_12px_rgba(0,255,65,0.2)]";
                            textMainColor = "text-primary";
                            textSubColor = "text-primary/80";
                        } else if (isPassed) {
                            cardStyle +=
                                "bg-transparent border-dashed border-white/20";
                            textMainColor = "text-white/40";
                            textSubColor = "text-white/30";
                        } else {
                            cardStyle += "bg-card border-white/20";
                            textMainColor = "text-white/90";
                            textSubColor = "text-white/50";
                        }

                        return (
                            <View key={idx} className="flex-row">
                                <View className="w-8 items-center justify-start mr-2 pt-4">
                                    <View
                                        className={`w-3 h-3 rounded-full border ${isCompleted ? "bg-primary/40 border-primary/40" : isNow ? "bg-primary border-primary shadow-[0_0_8px_rgba(0,255,65,1)]" : "bg-transparent border-primary/50"}`}
                                    />
                                    {idx !== planItems.length - 1 && (
                                        <View className="w-[1px] flex-1 bg-primary/30 my-2" />
                                    )}
                                </View>

                                <View
                                    key={item.sessionId}
                                    className={`flex-1 flex-col ${cardStyle} ${glowEffect}`}
                                >
                                    <View className="flex-row justify-between items-start gap-4 mb-4">
                                        <View className="flex-1">
                                            <Text
                                                className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${textSubColor}`}
                                            >
                                                Area:{" "}
                                                {item.areaName || "UNKNOWN"}
                                            </Text>
                                            <Text
                                                className={`text-sm font-bold uppercase ${textMainColor}`}
                                                numberOfLines={2}
                                            >
                                                {item.subareaName ||
                                                    "UNDEFINED_TASK"}
                                            </Text>
                                        </View>

                                        <View
                                            className="items-end border-l-2 pl-3"
                                            style={{
                                                borderColor:
                                                    isPassed || isCompleted
                                                        ? hexToRgba(
                                                              item.areaColor,
                                                              0.3,
                                                          )
                                                        : hexToRgba(
                                                              item.areaColor,
                                                              1,
                                                          ),
                                            }}
                                        >
                                            <Text
                                                className={`font-mono text-xs font-bold ${textMainColor}`}
                                            >
                                                {formatDateTime(item.startTime)}
                                            </Text>
                                            <Text
                                                className={`font-mono text-[10px] mt-1 ${textSubColor}`}
                                            >
                                                {formatDateTime(item.endTime)}
                                            </Text>
                                            <Text
                                                className={`text-[9px] uppercase mt-2 tracking-widest ${textSubColor}`}
                                            >
                                                {item.minutes} MIN
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="items-start border-t border-primary/20 pt-3 mt-1">
                                        {(() => {
                                            const isDisabled =
                                                !isCompleted &&
                                                (hasNotStarted || isPassed);
                                            let buttonText = "Check In";
                                            let btnStyle =
                                                "border-white/20 bg-transparent";
                                            let btnText = "text-white/60";

                                            if (isCompleted) {
                                                buttonText = "Completed";
                                                btnStyle =
                                                    "border-transparent bg-transparent";
                                                btnText = "text-white/30";
                                            } else if (isPassed) {
                                                buttonText = "Passed";
                                                btnStyle =
                                                    "border-transparent bg-transparent";
                                                btnText = "text-white/40";
                                            } else if (hasNotStarted) {
                                                buttonText = "Standby";
                                                btnStyle =
                                                    "border-transparent bg-transparent";
                                                btnText = "text-white/40";
                                            } else if (isNow) {
                                                // Tombol eksekusi menyala hijau HANYA saat waktunya tiba
                                                btnStyle =
                                                    "border-primary bg-primary";
                                                btnText =
                                                    "text-black font-black";
                                            }

                                            return (
                                                <Pressable
                                                    onPress={() =>
                                                        !isDisabled &&
                                                        toggleEventCompletion(
                                                            item.id,
                                                        )
                                                    }
                                                    disabled={isDisabled}
                                                    className={`px-3 py-2 border ${btnStyle} ${isDisabled && !isCompleted && !isPassed && !hasNotStarted ? "opacity-50" : ""}`}
                                                >
                                                    <Text
                                                        className={`text-[10px] text-center font-mono uppercase tracking-widest ${btnText}`}
                                                    >
                                                        {buttonText}
                                                    </Text>
                                                </Pressable>
                                            );
                                        })()}
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
