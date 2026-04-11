import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { useAreas } from "./useAreas";
import { usePlans } from "./usePlans";
import { calendarsClient, plansClient, subareasClient } from "../lib/client";
import { getAuthHeaders } from "../lib/authHeaders";
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

const demoSchedule: ScheduleItem[] = [
    {
        areaId: "demo-area-1",
        areaName: "Health",
        weight: 4,
        subareas: [
            {
                subareaId: "demo-sub-1",
                subareaName: "Workout",
                weight: 5,
            },
            {
                subareaId: "demo-sub-2",
                subareaName: "Stretching",
                weight: 2,
            },
        ],
    },
    {
        areaId: "demo-area-2",
        areaName: "Study",
        weight: 5,
        subareas: [
            {
                subareaId: "demo-sub-3",
                subareaName: "Algorithms",
                weight: 4,
            },
            {
                subareaId: "demo-sub-4",
                subareaName: "System Design",
                weight: 3,
            },
        ],
    },
    {
        areaId: "demo-area-3",
        areaName: "Career",
        weight: 3,
        subareas: [
            {
                subareaId: "demo-sub-5",
                subareaName: "Interview Prep",
                weight: 4,
            },
        ],
    },
];

const demoBusySlots: BusySlot[] = [
    { start: getTodayIsoAt(9, 0), end: getTodayIsoAt(10, 0) },
    { start: getTodayIsoAt(12, 0), end: getTodayIsoAt(13, 0) },
    { start: getTodayIsoAt(15, 30), end: getTodayIsoAt(16, 15) },
];

export function useCalendarEngine() {
    const { user } = useAuth();
    const { data: areasData } = useAreas();
    const { data: plansData } = usePlans();
    const queryClient = useQueryClient();

    const [calendar, setCalendar] = useState<CalendarItem[]>([]);
    const [freeGaps, setFreeGaps] = useState<FreeGap[]>([]);
    const [minutes, setMinutes] = useState(0);
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
    const [rescheduledData, setRescheduledData] = useState<RescheduledItem[]>(
        [],
    );
    const [finalSchedule, setFinalSchedule] = useState<FinalScheduleItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            return;
        }

        const currentBusy = calendar[0]?.busy ?? [];
        const newBusy = [...currentBusy, { start: startIso, end: endIso }];

        setCalendar([{ id: "offline", name: "Manual", busy: newBusy }]);
        updateGaps(newBusy);
    };

    const removeManualEvent = (index: number) => {
        const currentBusy = calendar[0]?.busy ?? [];
        const newBusy = currentBusy.filter((_, i) => i !== index);

        setCalendar([{ id: "offline", name: "Manual", busy: newBusy }]);
        updateGaps(newBusy);
    };

    const loadDemoData = () => {
        setError(null);
        setSchedule(demoSchedule);
        setCalendar([
            {
                id: "demo-calendar",
                name: "Demo Day",
                busy: demoBusySlots,
            },
        ]);
        updateGaps(demoBusySlots);
        setRescheduledData([]);
        setFinalSchedule([]);
    };

    const runReschedule = (algo: "global" | "nested") => {
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

        setFinalSchedule(final);
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

                await plansClient.$delete(
                    {},
                    { headers: await getAuthHeaders() },
                );
            } else {
                await plansClient.$delete(
                    {},
                    { headers: await getAuthHeaders() },
                );
            }

            for (const data of rescheduledData) {
                await subareasClient[":id"].$put(
                    {
                        json: {
                            id: data.id,
                            name: data.subarea,
                            weight: data.weight,
                            allocatedMinutes: data.allocated,
                        },
                        param: { id: data.id },
                    },
                    { headers: await getAuthHeaders() },
                );
            }

            await plansClient.$post(
                {
                    json: finalSchedule.map((item) => ({
                        subarea_id: String(item.subareaId),
                        user_id: String(user.id),
                        start_time: item.start,
                        end_time: item.end,
                        minutes: item.minutes,
                    })),
                },
                { headers: await getAuthHeaders() },
            );

            queryClient.invalidateQueries({ queryKey: ["plan"] });
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
            const response = await calendarsClient.sync.$get(
                {},
                { headers: await getAuthHeaders() },
            );
            const data = await response.json();

            if (!data.ok) {
                setCalendar([]);
                setError(data.error ?? "Unable to load calendar data");
                return;
            }

            const gaps = data.freeTime as FreeGap[];
            setFreeGaps(gaps);
            setMinutes(gaps.reduce((acc, gap) => acc + gap.durationMinutes, 0));
            setCalendar(data.calendarData ?? []);
        } catch (loadError) {
            setCalendar([]);
            setError(
                loadError instanceof Error
                    ? loadError.message
                    : "Unable to load calendar data",
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (areasData?.ok && areasData.data) {
            Promise.all(
                areasData.data.map(async (area: any) => {
                    const response = await subareasClient[":id"].$get(
                        { param: { id: area.id } },
                        { headers: await getAuthHeaders() },
                    );
                    const subareaData: any = await response.json();

                    return {
                        areaId: area.id,
                        areaName: area.name,
                        weight: area.weight || 1,
                        subareas: (subareaData.data || []).map(
                            (subarea: any) => ({
                                subareaId: subarea.id,
                                subareaName: subarea.name,
                                weight: subarea.weight || 1,
                            }),
                        ),
                    };
                }),
            ).then((transformedData) => setSchedule(transformedData));
        }
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
        error,
        user,
        schedule,
        actions: {
            addManualEvent,
            removeManualEvent,
            loadDemoData,
            runReschedule,
            saveToDatabase,
            getData,
        },
    };
}
