import { Pressable, Text, View } from "react-native";
import { useAllActions, useUpdateAction } from "../../hooks/useActions";
import { useState } from "react";
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

const DEFAULT_COLOR = "#008c23";

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

export const PlanCard = ({
    item,
    idx,
    totalItems,
    isCompleted,
    isNow,
    isPassed,
    hasNotStarted,
    toggleEventCompletion,
}: {
    item: PlanItem;
    idx: number;
    totalItems: number;
    isCompleted: boolean;
    isNow: boolean;
    isPassed: boolean;
    hasNotStarted: boolean;
    toggleEventCompletion: (id: string) => void;
}) => {
    const { data: actionsData, isLoading: isActionsLoading } = useAllActions(
        item.subareaId,
    );
    const { mutate: updateAction } = useUpdateAction();

    const [isExpanded, setIsExpanded] = useState(false);

    const actions = actionsData?.ok ? (actionsData.data as any[]) : [];
    const pendingActions = actions.filter((a) => !a.isCompleted);

    const displayedActions = isExpanded ? actions : pendingActions.slice(0, 2);
    const hiddenCount = actions.length - pendingActions.slice(0, 2).length;

    let cardStyle = "p-4 border ";
    let textMainColor = "text-foreground";
    let textSubColor = "text-foreground/50";
    let glowEffect = "";

    if (isCompleted) {
        cardStyle += "border-foreground/10 bg-foreground/5";
        textMainColor = "text-foreground/30 line-through";
        textSubColor = "text-foreground/20 line-through";
    } else if (isNow) {
        cardStyle += "border-primary bg-primary/10";
        glowEffect = "shadow-lg shadow-primary/20";
        textMainColor = "text-primary";
        textSubColor = "text-primary/80";
    } else if (isPassed) {
        cardStyle += "bg-transparent border-dashed border-foreground/20";
        textMainColor = "text-foreground/40";
        textSubColor = "text-foreground/30";
    } else {
        cardStyle += "bg-card border-foreground/20";
        textMainColor = "text-foreground/90";
        textSubColor = "text-foreground/50";
    }

    let buttonText = "Check In";
    let btnStyle = "border-foreground/20 bg-transparent";
    let btnText = "text-foreground/60";
    const isDisabled = isPassed || hasNotStarted;

    if (isCompleted) {
        buttonText = "Completed";
        btnStyle = "border-transparent bg-transparent";
        btnText = "text-foreground/30";
    } else if (isPassed) {
        buttonText = "Passed";
        btnStyle = "border-transparent bg-transparent";
        btnText = "text-foreground/40";
    } else if (hasNotStarted) {
        buttonText = "Standby";
        btnStyle = "border-transparent bg-transparent";
        btnText = "text-foreground/40";
    } else if (isNow) {
        btnStyle = "border-primary bg-primary";
        btnText = "text-background font-black";
    }

    return (
        <View className="flex-row">
            <View className="w-8 items-center justify-start mr-2 pt-4">
                <View
                    className={`w-3 h-3 rounded-full border ${isCompleted ? "bg-primary/40 border-primary/40" : isNow ? "bg-primary border-primary shadow-md shadow-primary" : "bg-transparent border-primary/50"}`}
                />
                {idx !== totalItems - 1 && (
                    <View className="w-px flex-1 bg-primary/30 my-2" />
                )}
            </View>

            <View className={`flex-1 flex-col ${cardStyle} ${glowEffect}`}>
                <View className="flex-row justify-between items-start gap-4 mb-3">
                    <View className="flex-1">
                        <Text
                            className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${textSubColor}`}
                        >
                            Area: {item.areaName || "UNKNOWN"}
                        </Text>
                        <Text
                            className={`text-sm font-bold uppercase ${textMainColor}`}
                            numberOfLines={2}
                        >
                            {item.subareaName || "UNDEFINED_TASK"}
                        </Text>

                        {!isCompleted && !isPassed && (
                            <View className="mt-2 flex flex-col gap-1">
                                {isActionsLoading ? (
                                    <Text
                                        className={`text-[9px] font-mono italic ${textSubColor}`}
                                    >
                                        Loading tasks...
                                    </Text>
                                ) : actions.length > 0 ? (
                                    <>
                                        {displayedActions.map((task) => (
                                            <Pressable
                                                key={task.id}
                                                onPress={() => {
                                                    if (isExpanded) {
                                                        updateAction({
                                                            id: task.id,
                                                            isCompleted:
                                                                !task.isCompleted,
                                                        });
                                                    }
                                                }}
                                                className={`flex-row items-start gap-1 ${isExpanded ? "py-1" : ""}`}
                                            >
                                                {isExpanded ? (
                                                    <View
                                                        className={`w-3 h-3 mt-0.5 border flex items-center justify-center ${
                                                            task.isCompleted
                                                                ? textMainColor.includes(
                                                                      "primary",
                                                                  )
                                                                    ? "bg-primary border-primary"
                                                                    : "bg-foreground/50 border-foreground/50"
                                                                : textMainColor.includes(
                                                                        "primary",
                                                                    )
                                                                  ? "border-primary"
                                                                  : "border-foreground/50"
                                                        }`}
                                                    />
                                                ) : (
                                                    <Text
                                                        className={`text-[10px] font-mono ${textMainColor}`}
                                                    >
                                                        {">"}
                                                    </Text>
                                                )}

                                                <Text
                                                    className={`text-[10px] font-mono flex-1 ${textMainColor} ${task.isCompleted ? "line-through opacity-50" : ""}`}
                                                    numberOfLines={
                                                        isExpanded
                                                            ? undefined
                                                            : 1
                                                    }
                                                >
                                                    {task.title}
                                                </Text>
                                            </Pressable>
                                        ))}

                                        {hiddenCount > 0 && (
                                            <Pressable
                                                onPress={() =>
                                                    setIsExpanded(!isExpanded)
                                                }
                                                className="mt-1 flex-row items-center gap-1 active:opacity-50"
                                            >
                                                <Text
                                                    className={`text-[9px] font-mono font-bold tracking-widest uppercase ${textSubColor}`}
                                                >
                                                    {isExpanded
                                                        ? "[- COLLAPSE]"
                                                        : `[+ EXPAND ${hiddenCount} MORE]`}
                                                </Text>
                                            </Pressable>
                                        )}
                                    </>
                                ) : (
                                    <Text
                                        className={`text-[9px] font-mono italic ${textSubColor}`}
                                    >
                                        No actions defined.
                                    </Text>
                                )}
                            </View>
                        )}
                    </View>

                    <View
                        className="items-end border-l-2 pl-3"
                        style={{
                            borderColor:
                                isPassed || isCompleted
                                    ? hexToRgba(item.areaColor, 0.3)
                                    : hexToRgba(item.areaColor, 1),
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
                    <Pressable
                        onPress={() =>
                            !isDisabled && toggleEventCompletion(item.id)
                        }
                        disabled={isDisabled}
                        className={`px-3 py-2 border ${btnStyle} ${isDisabled ? "opacity-50" : ""}`}
                    >
                        <Text
                            className={`text-[10px] text-center font-mono uppercase tracking-widest ${btnText}`}
                        >
                            {buttonText}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};
