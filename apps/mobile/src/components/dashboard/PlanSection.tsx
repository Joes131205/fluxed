import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { usePlans } from "../../hooks/usePlans";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    subareaColor?: string;
    areaColor?: string;
};

export const PlanSection = () => {
    const { data: plansData, isLoading: isPlansLoading } = usePlans();
    console.log(plansData);
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

    const DEFAULT_COLOR = "#00cdfd";

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

    const getContrastTextColor = (hex?: string) => {
        const fallback = DEFAULT_COLOR.replace(/^#+/, "").slice(0, 6);
        const candidate = (hex ?? "").trim().replace(/^#+/, "").slice(0, 6);
        const raw = /^[0-9a-fA-F]{6}$/.test(candidate) ? candidate : fallback;
        const num = parseInt(raw, 16);
        const r = (num >> 16) & 255;
        const g = (num >> 8) & 255;
        const b = num & 255;
        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return luminance > 150 ? "#0b0b0b" : "#ffffff";
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
        <View className="flex flex-col gap-5">
            <Text
                className="text-xl text-white tracking-widest font-bold"
                style={{ fontFamily: "PressStart2P_400Regular" }}
            >
                Your Plan Timeline
            </Text>
            <View className="mb-6">
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-white font-bold text-sm uppercase tracking-widest">
                        Progress
                    </Text>
                    <Text className="text-white/60 text-xs font-mono">
                        {progress.length} / {length}
                    </Text>
                </View>
                <View className="w-full h-4 bg-white/10 border border-white/30 overflow-hidden">
                    <View
                        className="h-full bg-white transition-all duration-500"
                        style={{
                            width: `${length > 0 ? (progress.length / length) * 100 : 0}%`,
                        }}
                    />
                </View>
                <Text className="text-white/40 text-xs mt-2 uppercase tracking-widest font-mono">
                    {length > 0
                        ? Math.round((progress.length / length) * 100)
                        : 0}
                    %
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
                        const isCompleted = progress.includes(item.id);
                        const startTime = new Date(item.startTime);
                        const endTime = new Date(item.endTime);
                        const isNow = now >= startTime && now <= endTime;
                        const isPassed = now >= endTime;

                        let cardStyle = "p-5 border-2 flex-col ";
                        let textMainColor = "";
                        let textSubColor = "";

                        if (isCompleted) {
                            cardStyle += "shadow-lg";
                            textMainColor = "text-white";
                            textSubColor = "text-white/60";
                        } else if (isNow) {
                            cardStyle += "shadow-lg";
                            textMainColor = "text-white";
                            textSubColor = "text-white/60";
                        } else if (isPassed) {
                            cardStyle += "bg-transparent border-dashed";
                            textMainColor = "text-white/40";
                            textSubColor = "text-white/30";
                        } else {
                            cardStyle += "bg-transparent";
                            textMainColor = "text-white";
                            textSubColor = "text-white/60";
                        }

                        return (
                            <View key={idx}>
                                <View
                                    key={item.sessionId}
                                    className={cardStyle}
                                    style={{
                                        borderColor: isCompleted
                                            ? hexToRgba("#00FF00", 0.7)
                                            : isNow
                                              ? hexToRgba(item.areaColor, 1)
                                              : isPassed
                                                ? "rgba(255,255,255,0.3)"
                                                : hexToRgba(
                                                      item.areaColor,
                                                      0.4,
                                                  ),
                                    }}
                                >
                                    <View className="flex-row justify-between items-start gap-4 mb-4">
                                        <View className="flex-1">
                                            <Text
                                                className={`text-xs font-black uppercase tracking-widest mb-2 ${textSubColor}`}
                                            >
                                                {item.areaName ||
                                                    "Not defined?"}
                                            </Text>
                                            <Text
                                                className={`text-sm leading-6 ${textMainColor}`}
                                                style={{
                                                    fontFamily:
                                                        "PressStart2P_400Regular",
                                                }}
                                                numberOfLines={2}
                                            >
                                                {item.subareaName ||
                                                    "Not defined?"}
                                            </Text>
                                        </View>

                                        <View
                                            className="items-end border-l-2 border-current pl-4"
                                            style={{
                                                borderColor: hexToRgba(
                                                    item.subareaColor ??
                                                        item.areaColor,
                                                ),
                                            }}
                                        >
                                            <Text
                                                className={`font-mono text-sm font-black ${textMainColor}`}
                                            >
                                                {formatDateTime(item.startTime)}
                                            </Text>
                                            <Text
                                                className={`font-mono text-xs font-bold mt-1 ${textSubColor}`}
                                            >
                                                {formatDateTime(item.endTime)}
                                            </Text>
                                            <Text
                                                className={`text-[10px] font-black uppercase mt-2 tracking-widest ${textMainColor}`}
                                            >
                                                {item.minutes} MIN
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="items-center justify-center">
                                        {(() => {
                                            const hasNotStarted =
                                                !isNow && !isPassed;
                                            const isDisabled =
                                                !isCompleted &&
                                                (hasNotStarted || isPassed);

                                            let buttonText = "Check In";
                                            if (isCompleted)
                                                buttonText = "Completed";
                                            else if (isPassed)
                                                buttonText = "Passed";
                                            else if (hasNotStarted)
                                                buttonText = "Not Started";

                                            return (
                                                <Pressable
                                                    onPress={() =>
                                                        !isDisabled &&
                                                        toggleEventCompletion(
                                                            item.id,
                                                        )
                                                    }
                                                    disabled={isDisabled}
                                                    className={`w-full px-3 py-4 border-2 ${
                                                        isDisabled
                                                            ? "opacity-50"
                                                            : ""
                                                    }`}
                                                    style={{
                                                        borderColor: isCompleted
                                                            ? hexToRgba(
                                                                  "#00FF00",
                                                                  0.7,
                                                              )
                                                            : isNow
                                                              ? hexToRgba(
                                                                    item.subareaColor,
                                                                    1,
                                                                )
                                                              : "rgba(255,255,255,0.6)",
                                                        backgroundColor:
                                                            isCompleted
                                                                ? hexToRgba(
                                                                      "#00FF00",
                                                                      0.15,
                                                                  )
                                                                : !isDisabled &&
                                                                    isNow
                                                                  ? hexToRgba(
                                                                        item.subareaColor,
                                                                        0.1,
                                                                    )
                                                                  : "transparent",
                                                    }}
                                                >
                                                    <Text
                                                        className="w-full text-xs text-center font-black uppercase tracking-widest"
                                                        style={{
                                                            color: isCompleted
                                                                ? hexToRgba(
                                                                      "#FFFFFF",
                                                                      0.9,
                                                                  )
                                                                : isDisabled
                                                                  ? hexToRgba(
                                                                        "#FFFFFF",
                                                                        0.4,
                                                                    )
                                                                  : isNow
                                                                    ? hexToRgba(
                                                                          "#FFFFFF",
                                                                          0.9,
                                                                      )
                                                                    : hexToRgba(
                                                                          "#FFFFFF",
                                                                          0.4,
                                                                      ),
                                                        }}
                                                    >
                                                        {buttonText}
                                                    </Text>
                                                </Pressable>
                                            );
                                        })()}
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
