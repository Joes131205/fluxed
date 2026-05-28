import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { useAreas } from "./useAreas";
import { usePlans } from "./usePlans";
import { plansClient, subareasClient } from "../lib/client";
import {
    calcGlobalWeightedTime,
    calcNestedWeightedTime,
} from "../utils/reschedule";

type BusySlot = {
    start: string;
    end: string;
};

type CalendarItem = {
    id: string;
    name: string;
    busy: BusySlot[];
};

type ScheduleItem = {
    areaId: string;
    areaName: string;
    weight: number;
    subareas: {
        subareaId: string;
        subareaName: string;
        weight: number;
    }[];
};

type RescheduledItem = {
    area: string;
    id: string;
    subarea: string;
    weight: number;
    allocated: number;
};

type FinalScheduleItem = {
    subareaId: string;
    subarea: string;
    area: string;
    start: string;
    end: string;
    minutes: number;
};

type FreeGap = {
    start: string;
    end: string;
    durationMinutes: number;
};

const getTodayIsoAt = (hour: number, minute: number) => {
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    return date.toISOString();
};

const demoBusySlots: BusySlot[] = [
    { start: getTodayIsoAt(9, 0), end: getTodayIsoAt(10, 0) },
    { start: getTodayIsoAt(12, 0), end: getTodayIsoAt(13, 0) },
    { start: getTodayIsoAt(15, 30), end: getTodayIsoAt(16, 15) },
];

export function useCalendarEngine() {
    const { user } = useAuth();
    const { data: areasData, isLoading: isAreaLoading } = useAreas();
    const { data: plansData, isLoading: isPlanLoading } = usePlans();
    const queryClient = useQueryClient();

    const [calendar, setCalendar] = useState<CalendarItem[]>([]);
    const [freeGaps, setFreeGaps] = useState<FreeGap[]>([]);
    const [minutes, setMinutes] = useState(0);
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
    const [rescheduledData, setRescheduledData] = useState<RescheduledItem[]>(
        [],
    );
    const [finalSchedule, setFinalSchedule] = useState<FinalScheduleItem[]>([]);
    const [isScheduleLoading, setIsScheduleLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isGeneratedOnce, setIsGeneratedOnce] = useState(false);

    const toTodayIso = (time: string) => {
        const [h, m] = time.split(":").map(Number);

        if (isNaN(h) || isNaN(m)) {
            return null;
        }

        const date = new Date();
        date.setHours(h, m, 0, 0);
        return date.toISOString();
    };

    const updateGaps = (busySlots: BusySlot[]) => {
        const sorted = [...busySlots].sort(
            (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
        );

        const gaps: FreeGap[] = [];
        let curr = new Date();
        const night = new Date();
        night.setHours(23, 59, 59, 999);

        for (const slot of sorted) {
            const start = new Date(slot.start);
            const end = new Date(slot.end);

            if (start > curr) {
                gaps.push({
                    start: curr.toISOString(),
                    end: start.toISOString(),
                    durationMinutes: Math.round(
                        (start.getTime() - curr.getTime()) / 60000,
                    ),
                });
            }

            if (end > curr) {
                curr = end;
            }
        }

        if (curr < night) {
            gaps.push({
                start: curr.toISOString(),
                end: night.toISOString(),
                durationMinutes: Math.round(
                    (night.getTime() - curr.getTime()) / 60000,
                ),
            });
        }

        setFreeGaps(gaps);
        setMinutes(gaps.reduce((acc, gap) => acc + gap.durationMinutes, 0));
    };

    const addManualEvent = (startTimeStr: string, endTimeStr: string) => {
        const startIso = toTodayIso(startTimeStr);
        const endIso = toTodayIso(endTimeStr);

        if (!startIso || !endIso || new Date(endIso) <= new Date(startIso)) {
            Alert.alert(
                "Invalid Time",
                "Please enter valid start and end times.",
            );
            return;
        }

        const currentBusy = calendar[0]?.busy ?? [];
        const newBusy = [...currentBusy, { start: startIso, end: endIso }];

        setCalendar([
            { id: "offline", name: "Manual Busy Blocks", busy: newBusy },
        ]);
        updateGaps(newBusy);
    };

    const removeManualEvent = (index: number) => {
        const currentBusy = calendar[0]?.busy ?? [];
        const newBusy = currentBusy.filter((_, i) => i !== index);

        setCalendar([{ id: "offline", name: "Manual", busy: newBusy }]);
        updateGaps(newBusy);
    };

    const runReschedule = (algo: string) => {
        const [hour = "23", minute = "59"] = (user?.endTime ?? "23:59").split(
            ":",
        );
        const dayDone = new Date();
        dayDone.setHours(Number(hour), Number(minute), 0, 0);

        const usableGaps = freeGaps.filter(
            (gap) => new Date(gap.start) < dayDone,
        );
        const totalUsableMinutes = usableGaps.reduce((acc, gap) => {
            const end =
                new Date(gap.end) > dayDone ? dayDone : new Date(gap.end);
            const start = new Date(gap.start);
            return acc + (end.getTime() - start.getTime()) / 60000;
        }, 0);

        const rescheduled =
            algo === "global"
                ? calcGlobalWeightedTime(schedule, totalUsableMinutes)
                : calcNestedWeightedTime(schedule, totalUsableMinutes);

        setRescheduledData(rescheduled);

        const roundingInterval = 15;
        const roundMinutes = (value: number) =>
            Math.round(value / roundingInterval) * roundingInterval;

        const final: FinalScheduleItem[] = [];
        let gapIndex = 0;
        const tempGaps = JSON.parse(JSON.stringify(usableGaps)).map(
            (gap: FreeGap) => {
                const gapEnd = new Date(gap.end);

                if (gapEnd > dayDone) {
                    return {
                        ...gap,
                        end: dayDone.toISOString(),
                        durationMinutes:
                            (dayDone.getTime() -
                                new Date(gap.start).getTime()) /
                            60000,
                    };
                }

                return gap;
            },
        );

        rescheduled.forEach((item) => {
            if (item.allocated < (user?.minDuration || 15)) {
                return;
            }

            let minutesLeft = item.allocated;

            while (minutesLeft > 0 && gapIndex < tempGaps.length) {
                const currentGap = tempGaps[gapIndex] as FreeGap;
                const gapStart = new Date(currentGap.start);
                const roundedStartMinutes =
                    Math.ceil(gapStart.getMinutes() / roundingInterval) *
                    roundingInterval;

                gapStart.setMinutes(roundedStartMinutes, 0, 0);
                const actualStart = gapStart.toISOString();

                let amountToFit = Math.min(
                    minutesLeft,
                    currentGap.durationMinutes,
                );
                amountToFit = roundMinutes(amountToFit);

                if (amountToFit >= (user?.minDuration || 10)) {
                    const endTime = new Date(
                        new Date(actualStart).getTime() + amountToFit * 60000,
                    ).toISOString();

                    final.push({
                        subareaId: item.id,
                        subarea: item.subarea,
                        area: item.area,
                        start: actualStart,
                        end: endTime,
                        minutes: amountToFit,
                    });

                    minutesLeft -= amountToFit;

                    const totalBlockTime =
                        amountToFit + (user?.timeBuffer || 0);
                    currentGap.durationMinutes -= totalBlockTime;
                    currentGap.start = new Date(
                        new Date(actualStart).getTime() +
                            totalBlockTime * 60000,
                    ).toISOString();
                } else {
                    minutesLeft = 0;
                }

                if (currentGap.durationMinutes <= roundingInterval / 2) {
                    gapIndex++;
                }
            }
        });
        console.log(final);
        setFinalSchedule(final);
        setIsGeneratedOnce(true);
    };

    const saveToDatabase = async () => {
        if (!user?.id) {
            return;
        }

        setIsLoading(true);

        try {
            if (plansData?.data?.length) {
                const shouldReplace = await new Promise<boolean>((resolve) => {
                    Alert.alert(
                        "Replace existing plan?",
                        "Saving this schedule will replace your current plan.",
                        [
                            {
                                text: "Cancel",
                                style: "cancel",
                                onPress: () => resolve(false),
                            },
                            {
                                text: "Replace",
                                style: "destructive",
                                onPress: () => resolve(true),
                            },
                        ],
                    );
                });

                if (!shouldReplace) {
                    return;
                }

                await plansClient.deletePlan();
            } else {
                await plansClient.deletePlan();
            }

            for (const data of rescheduledData) {
                await subareasClient.updateSubarea(data.id, {
                    name: data.subarea,
                    weight: data.weight,
                    allocatedMinutes: data.allocated,
                });
            }

            await plansClient.updatePlan(
                finalSchedule.map((item) => ({
                    subarea_id: String(item.subareaId),
                    user_id: String(user.id),
                    start_time: item.start,
                    end_time: item.end,
                    minutes: item.minutes,
                })),
            );

            queryClient.invalidateQueries({ queryKey: ["plan"] });

            Alert.alert(
                "Success",
                "Your schedule has been saved successfully!",
            );
        } catch (saveError) {
            setError(
                saveError instanceof Error
                    ? saveError.message
                    : "Unable to save schedule",
            );
        } finally {
            setIsLoading(false);
        }
    };

    const getData = async () => {
        if (!user?.googleId) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            Alert.alert(
                "Not Available",
                "Calendar sync is not available in the current version",
            );
            setIsLoading(false);
        } catch (loadError) {
            setCalendar([]);
            const errorMsg =
                loadError instanceof Error
                    ? loadError.message
                    : "Unable to load calendar data";
            setError(errorMsg);
            Alert.alert("Error", errorMsg);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const areasPayload = Array.isArray(areasData)
            ? (areasData as any[])
            : areasData?.data;

        if (!areasPayload || areasPayload.length === 0) {
            setSchedule([]);
            setIsScheduleLoading(false);
            return;
        }

        let isMounted = true;

        const hydrateSchedule = async () => {
            setIsScheduleLoading(true);
            try {
                const transformedData = await Promise.all(
                    areasPayload.map(async (area: any) => {
                        const subareaData = await subareasClient.getSubareaByArea(
                            area.id,
                        );

                        const subareaList = Array.isArray(subareaData)
                            ? subareaData
                            : subareaData?.data || [];

                        return {
                            areaId: area.id,
                            areaName: area.name,
                            weight: area.weight || 1,
                            subareas: (subareaList || []).map((subarea: any) => ({
                                subareaId: subarea.id,
                                subareaName: subarea.name,
                                weight: subarea.weight || 1,
                                color: subarea.color,
                            })),
                            color: area.color,
                        };
                    }),
                );

                if (isMounted) {
                    setSchedule(transformedData);
                }
            } finally {
                if (isMounted) {
                    setIsScheduleLoading(false);
                }
            }
        };

        void hydrateSchedule();

        return () => {
            isMounted = false;
        };
    }, [areasData]);

    useEffect(() => {
        if (!user?.googleId) {
            updateGaps([]);
        }
    }, [user?.googleId]);

    return {
        calendar,
        freeGaps,
        minutes,
        rescheduledData,
        finalSchedule,
        isLoading,
        isPlanLoading,
        isAreaLoading,
        isScheduleLoading,
        error,
        user,
        schedule,
        isGeneratedOnce,
        actions: {
            addManualEvent,
            removeManualEvent,
            runReschedule,
            saveToDatabase,
            getData,
        },
    };
}
