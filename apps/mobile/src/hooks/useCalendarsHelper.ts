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
    description?: string;
    isExcluded: boolean;
    weight: number;
    subareas: {
        subareaId: string;
        subareaName: string;
        description?: string;
        isExcluded: boolean;
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

        setCalendar((prev) => {
            const updated = [...prev];
            const manualIdx = updated.findIndex((c) => c.id === "offline");

            if (manualIdx >= 0) {
                updated[manualIdx].busy.push({ start: startIso, end: endIso });
            } else {
                updated.push({
                    id: "offline",
                    name: "Manual Overrides",
                    busy: [{ start: startIso, end: endIso }],
                });
            }

            const allBusy = updated.flatMap((c) => c.busy);
            updateGaps(allBusy);

            return updated;
        });
    };

    const removeManualEvent = (indexToRemove: number) => {
        setCalendar((prev) => {
            const updated = [...prev];
            const manualIdx = updated.findIndex((c) => c.id === "offline");

            if (manualIdx >= 0) {
                updated[manualIdx].busy = updated[manualIdx].busy.filter(
                    (_, i) => i !== indexToRemove,
                );

                const allBusy = updated.flatMap((c) => c.busy);
                updateGaps(allBusy);
            }
            return updated;
        });
    };

    const toggleAreaExclude = (areaId: string) => {
        setSchedule((prev) =>
            prev.map((area) =>
                area.areaId === areaId
                    ? { ...area, isExcluded: !area.isExcluded }
                    : area,
            ),
        );
    };

    const toggleSubareaExclude = (areaId: string, subareaId: string) => {
        setSchedule((prev) =>
            prev.map((area) => {
                if (area.areaId === areaId) {
                    return {
                        ...area,
                        subareas: area.subareas.map((sub) =>
                            sub.subareaId === subareaId
                                ? { ...sub, isExcluded: !sub.isExcluded }
                                : sub,
                        ),
                    };
                }
                return area;
            }),
        );
    };

    const addTemporaryTask = (name: string, weight: number) => {
        const TEMP_AREA_ID = "sys-temp-override";
        const newSubareaId = `temp-sub-${Date.now()}`;

        setSchedule((prev) => {
            const existingTempIndex = prev.findIndex(
                (area) => area.areaId === TEMP_AREA_ID,
            );

            if (existingTempIndex >= 0) {
                const updatedSchedule = [...prev];
                const tempArea = { ...updatedSchedule[existingTempIndex] };

                tempArea.subareas = [
                    {
                        subareaId: newSubareaId,
                        subareaName: name,
                        weight: weight,
                        isExcluded: false,
                    },
                    ...tempArea.subareas,
                ];

                updatedSchedule[existingTempIndex] = tempArea;
                return updatedSchedule;
            } else {
                return [
                    {
                        areaId: TEMP_AREA_ID,
                        areaName: "Temporary",
                        description: "Temporary tasks ",
                        weight: 5,
                        isExcluded: false,
                        subareas: [
                            {
                                subareaId: newSubareaId,
                                subareaName: name,
                                weight: weight,
                                isExcluded: false,
                                color: "#00f0ff",
                            },
                        ],
                    },
                    ...prev,
                ];
            }
        });
    };
    const runReschedule = (algo: string, activeAreas: any[]) => {
        const [hour = "23", minute = "59"] = (user?.endTime ?? "23:59").split(
            ":",
        );
        const dayDone = new Date();
        dayDone.setHours(Number(hour), Number(minute), 0, 0);
        const cleanSchedule = activeAreas
            .filter((area) => !area.isExcluded)
            .map((area) => ({
                areaId: area.areaId,
                areaName: area.areaName,
                weight: area.weight,
                subareas: area.subareas
                    .filter((sub: any) => !sub.isExcluded)
                    .map((sub: any) => ({
                        subareaId: sub.subareaId,
                        subareaName: sub.subareaName,
                        weight: sub.weight,
                    })),
            }))
            .filter((area) => area.subareas.length > 0);
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
                ? calcGlobalWeightedTime(cleanSchedule, totalUsableMinutes)
                : calcNestedWeightedTime(cleanSchedule, totalUsableMinutes);

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

    const saveToGCal = async () => {
        const shouldSync = await new Promise<boolean>((resolve) => {
            Alert.alert(
                "Regenerate Google Calendar?",
                "Saving this schedule will replace your existing Google Calendar if any.",
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

        if (!shouldSync) {
            return;
        }

        setIsLoading(true);
        try {
            const payload = finalSchedule.map((item) => ({
                subarea_id: String(item.subareaId),
                area_name: item.area,
                subarea_name: item.subarea,
                user_id: String(user?.id),
                start_time: item.start,
                end_time: item.end,
                minutes: item.minutes,
            }));

            const response = await plansClient.gcal.$post(
                { json: payload },
                { headers: await getAuthHeaders() },
            );
            if (!response.ok) {
                Alert.alert(
                    "Error",
                    "Failed to save the schedule to Google Calendar!",
                );
            }
            Alert.alert(
                "Success!",
                "Schedule put to the Google Calendar! Check it out!",
            );
        } catch (error) {
            setError("Unable to save schedule to Google Calendar");
            Alert.alert("Error", "Error!");
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
                const errorMsg = data.error ?? "Unable to load calendar data";
                setError(errorMsg);
                Alert.alert("Error", errorMsg);
                return;
            }

            const gaps = data.freeTime as FreeGap[];
            setFreeGaps(gaps);
            setMinutes(gaps.reduce((acc, gap) => acc + gap.durationMinutes, 0));
            setCalendar(data.calendarData ?? []);
            Alert.alert("Success", "Calendar data loaded successfully!");
        } catch (loadError) {
            setCalendar([]);
            const errorMsg =
                loadError instanceof Error
                    ? loadError.message
                    : "Unable to load calendar data";
            setError(errorMsg);
            Alert.alert("Error", errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const changeTime = async (idx: number, start: string, end: string) => {
        const startIso = toTodayIso(start);
        const endIso = toTodayIso(end);

        if (!startIso || !endIso) {
            Alert.alert(
                "Invalid Format",
                "Please use the correct HH:MM format (e.g. 09:30).",
            );
            return;
        }

        setFinalSchedule((prevSchedule) =>
            prevSchedule.map((item, i) =>
                i === idx ? { ...item, start: startIso, end: endIso } : item,
            ),
        );
    };

    useEffect(() => {
        if (!areasData?.ok || !areasData.data) {
            setSchedule([]);
            setIsScheduleLoading(false);
            return;
        }

        let isMounted = true;

        const hydrateSchedule = async () => {
            setIsScheduleLoading(true);
            try {
                const headers = await getAuthHeaders();
                const transformedData = await Promise.all(
                    areasData.data.map(async (area: any) => {
                        const response = await subareasClient[":id"].$get(
                            { param: { id: area.id } },
                            { headers },
                        );
                        const subareaData: any = await response.json();
                        return {
                            areaId: area.id,
                            areaName: area.name,
                            weight: area.weight || 1,
                            description: area.description,
                            isExcluded: false,
                            subareas: (subareaData.data || []).map(
                                (subarea: any) => ({
                                    subareaId: subarea.id,
                                    subareaName: subarea.name,
                                    description: area.description,
                                    isExcluded: false,
                                    weight: subarea.weight || 1,
                                    color: subarea.color,
                                }),
                            ),
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
        toggleAreaExclude,
        toggleSubareaExclude,
        actions: {
            addManualEvent,
            removeManualEvent,
            runReschedule,
            saveToDatabase,
            saveToGCal,
            getData,
            addTemporaryTask,
            changeTime,
        },
    };
}
