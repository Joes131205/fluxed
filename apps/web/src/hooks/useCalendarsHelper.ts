import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAreas } from "@/hooks/useAreas";
import { calendarsClient, plansClient, subareasClient } from "@/lib/client";
import { getAuthHeaders } from "@/lib/authHeaders";
import {
    calcGlobalWeightedTime,
    calcNestedWeightedTime,
} from "@/utils/reschedule";
import { useQueryClient } from "@tanstack/react-query";
import { usePlans } from "./usePlan";

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
    subareaId: any;
    subarea: string;
    area: string;
    start: Date;
    end: Date;
    minutes: number;
};

export function useCalendarEngine() {
    const { user } = useAuth();
    const { data: areasData } = useAreas();
    const { data: plansData } = usePlans();

    const queryClient = useQueryClient();

    const [calendar, setCalendar] = useState<CalendarItem[]>([]);
    const [freeGaps, setFreeGaps] = useState<any[]>([]);
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
        if (isNaN(h) || isNaN(m)) return null;
        const date = new Date();
        date.setHours(h, m, 0, 0);
        return date.toISOString();
    };

    const updateGaps = (busySlots: BusySlot[]) => {
        const sorted = [...busySlots].sort(
            (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
        );

        const gaps = [];
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
            if (end > curr) curr = end;
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
        setMinutes(gaps.reduce((acc, g) => acc + g.durationMinutes, 0));
    };

    const addManualEvent = (startTimeStr: string, endTimeStr: string) => {
        const startIso = toTodayIso(startTimeStr);
        const endIso = toTodayIso(endTimeStr);

        if (!startIso || !endIso) return;

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

    const runReschedule = (algo: "global" | "nested") => {
        const [hour = "23", minute = "59"] = (user?.endTime ?? "23:59").split(
            ":",
        );
        const dayDone = new Date();
        dayDone.setHours(Number(hour), Number(minute), 0, 0);

        const usableGaps = freeGaps.filter((g) => new Date(g.start) < dayDone);
        const totalUsableMinutes = usableGaps.reduce((acc, g) => {
            const end = new Date(g.end) > dayDone ? dayDone : new Date(g.end);
            const start = new Date(g.start);
            return acc + (end.getTime() - start.getTime()) / 60000;
        }, 0);

        const rescheduled =
            algo === "global"
                ? calcGlobalWeightedTime(schedule, totalUsableMinutes)
                : calcNestedWeightedTime(schedule, totalUsableMinutes);

        setRescheduledData(rescheduled);

        // Timeline fitting logic
        const final: any[] = [];
        let gapIndex = 0;
        let tempGaps = JSON.parse(JSON.stringify(usableGaps)).map(
            (gap: any) => {
                const gapEnd = new Date(gap.end);
                return gapEnd > dayDone
                    ? {
                          ...gap,
                          end: dayDone.toISOString(),
                          durationMinutes:
                              (dayDone.getTime() -
                                  new Date(gap.start).getTime()) /
                              60000,
                      }
                    : gap;
            },
        );

        rescheduled.forEach((item) => {
            if (item.allocated < (user?.minDuration || 15)) return;
            let minutesLeft = item.allocated;

            while (minutesLeft > 0 && gapIndex < tempGaps.length) {
                let currentGap = tempGaps[gapIndex];
                const amountToFit = Math.min(
                    minutesLeft,
                    currentGap.durationMinutes,
                );

                if (amountToFit > 0) {
                    final.push({
                        subareaId: item.id,
                        subarea: item.subarea,
                        area: item.area,
                        start: currentGap.start,
                        end: new Date(
                            new Date(currentGap.start).getTime() +
                                amountToFit * 60000,
                        ).toISOString(),
                        minutes: amountToFit,
                    });

                    minutesLeft -= amountToFit;
                    const timeWithBuffer =
                        amountToFit + (user?.timeBuffer || 0);
                    currentGap.durationMinutes -= timeWithBuffer;
                    currentGap.start = new Date(
                        new Date(currentGap.start).getTime() +
                            timeWithBuffer * 60000,
                    ).toISOString();
                }
                if (currentGap.durationMinutes <= 0) gapIndex++;
            }
        });
        setFinalSchedule(final);
    };

    const saveToDatabase = async () => {
        setIsLoading(true);

        if (plansData?.data!) {
            const confirmation = await window.confirm(
                "You have saved plan, saving it means deleting the whole plan, are you sure?",
            );

            if (!confirmation) {
                return;
            }
        }
        try {
            for (let i = 0; i < rescheduledData.length; i++) {
                const data = rescheduledData[i];
                await subareasClient[":id"].$put(
                    {
                        json: {
                            id: data.id,
                            name: data.subarea,
                            weight: data.weight,
                            allocatedMinutes: data.allocated,
                        },
                        param: {
                            id: data.id,
                        },
                    },
                    {
                        headers: getAuthHeaders,
                    },
                );
            }
            console.log(finalSchedule);

            await plansClient.$delete({}, { headers: getAuthHeaders });

            finalSchedule.map((item) => ({
                subarea_id: item.subareaId,
                user_id: user?.id!,
                start_time: new Date(item.start),
                end_time: new Date(item.end),
                minutes: item.minutes,
            }));

            await plansClient.$post(
                {
                    json: finalSchedule.map((item) => ({
                        subarea_id: String(item.subareaId),
                        user_id: String(user?.id!),
                        start_time: item.start,
                        end_time: item.end,
                        minutes: item.minutes,
                    })),
                },
                {
                    headers: getAuthHeaders,
                },
            );

            queryClient.resetQueries({ queryKey: ["plan"] });
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
                { headers: getAuthHeaders },
            );
            const data = await response.json();

            if (!data.ok) {
                setCalendar([]);
                setError(data.error ?? "Unable to load calendar data");
                return;
            }
            console.log(data.calendarData);

            const gaps = data.freeTime;
            setFreeGaps(gaps);
            setMinutes(
                gaps.reduce((a: any, b: any) => a + b.durationMinutes, 0),
            );

            setCalendar(data.calendarData ?? []);
        } catch (err) {
            setCalendar([]);
            setError(
                err instanceof Error
                    ? err.message
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
                        {
                            param: { id: area.id },
                        },
                        {
                            headers: getAuthHeaders,
                        },
                    );
                    const subareaData: any = await response.json();

                    return {
                        areaId: area.id,
                        areaName: area.name,
                        subareas: (subareaData.data || []).map(
                            (subarea: any) => ({
                                subareaId: subarea.id,
                                subareaName: subarea.name,
                                weight: subarea.weight || 1,
                            }),
                        ),
                        weight: area.weight,
                    };
                }),
            ).then((transformedData) => setSchedule(transformedData));
        }
    }, [areasData]);

    useEffect(() => {
        if (!user?.googleId) updateGaps([]);
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
            runReschedule,
            saveToDatabase,
            getData,
        },
    };
}
