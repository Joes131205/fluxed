import { getAuthHeaders } from "@/lib/authHeaders";
import { calendarsClient, client, subareasClient } from "@/lib/client";
import { useAreas } from "@/hooks/useAreas";
import { requireAuth } from "@/utils/requireAuth";
import {
    calcGlobalWeightedTime,
    calcNestedWeightedTime,
} from "@/utils/reschedule";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/dashboard/calendar")({
    beforeLoad: requireAuth,
    component: RouteComponent,
});

function RouteComponent() {
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
        subarea: string;
        area: string;
        start: string;
        end: string;
        minutes: number;
    };

    const [calendar, setCalendar] = useState<CalendarItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [minutes, setMinutes] = useState<number>(0);
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
    const [rescheduledData, setRescheduledData] = useState<RescheduledItem[]>(
        [],
    );
    const [finalSchedule, setFinalSchedule] = useState<FinalScheduleItem[]>([]);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<
        "global" | "nested"
    >("global");

    const [freeGaps, setFreeGaps] = useState<any[]>([]);

    const { data: areasData } = useAreas();

    const todayDateString = new Date().toDateString();

    const isToday = (isoDate: string) => {
        return new Date(isoDate).toDateString() === todayDateString;
    };

    const formatTime = (isoDate: string) => {
        return new Date(isoDate).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleGetData = async () => {
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
    const handleReschedule = () => {
        const rescheduled =
            selectedAlgorithm === "global"
                ? calcGlobalWeightedTime(schedule, minutes)
                : calcNestedWeightedTime(schedule, minutes);
        setRescheduledData(rescheduled);
        const final: any[] = [];
        let gapIndex = 0;

        let tempGaps = JSON.parse(JSON.stringify(freeGaps));

        rescheduled.forEach((item) => {
            let minutesLeft = item.allocated;

            while (minutesLeft > 0 && gapIndex < tempGaps.length) {
                let currentGap = tempGaps[gapIndex];

                const amountToFit = Math.min(
                    minutesLeft,
                    currentGap.durationMinutes,
                );

                if (amountToFit > 0) {
                    final.push({
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
                    currentGap.durationMinutes -= amountToFit;

                    currentGap.start = new Date(
                        new Date(currentGap.start).getTime() +
                            amountToFit * 60000,
                    ).toISOString();
                }

                if (currentGap.durationMinutes <= 0) {
                    gapIndex++;
                }
            }
        });
        console.log(final);
        setFinalSchedule(final);
    };

    const handleSave = async () => {
        for (let i = 0; i < rescheduledData.length; i++) {
            const data = rescheduledData[i];
            await client.api.subareas[":id"].$put(
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
    };
    useEffect(() => {
        handleGetData();
    }, []);

    useEffect(() => {
        if (areasData && "ok" in areasData && areasData.ok && areasData.data) {
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

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-100 via-white to-emerald-50 px-4 py-8 sm:py-12">
            <div className="mx-auto max-w-5xl space-y-8">
                <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="mb-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                                Daily Planner
                            </p>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                Calendar + Reschedule
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                                Sync today&apos;s busy blocks, review your free
                                minutes, then rebalance time allocation in one
                                focused workflow.
                            </p>
                        </div>
                        <button
                            onClick={handleGetData}
                            disabled={isLoading}
                            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                        >
                            {isLoading ? "Syncing..." : "Sync Calendar"}
                        </button>
                    </div>
                </div>

                {error && (
                    <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {error}
                    </p>
                )}

                {!isLoading && !error && calendar.length === 0 && (
                    <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                        No calendars available.
                    </p>
                )}

                <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Synced Calendars
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">
                            {calendar.length}
                        </p>
                    </div>
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                            Free Time Today
                        </p>
                        <p className="mt-2 text-2xl font-bold text-emerald-900">
                            {minutes} min
                        </p>
                    </div>
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                            Planned Slots
                        </p>
                        <p className="mt-2 text-2xl font-bold text-amber-900">
                            {rescheduledData.length}
                        </p>
                    </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Today&apos;s Busy Times
                        </h2>
                    </div>
                    {calendar.map((item) => {
                        const todayBusy = item.busy.filter(
                            (slot) => isToday(slot.start) || isToday(slot.end),
                        );

                        return (
                            <div
                                key={item.id}
                                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                            >
                                <h3 className="mb-3 text-base font-semibold text-slate-900 sm:text-lg">
                                    {item.name}
                                </h3>

                                {todayBusy.length === 0 ? (
                                    <p className="text-sm text-slate-600">
                                        Free for the rest of today.
                                    </p>
                                ) : (
                                    <ul className="grid gap-2 sm:grid-cols-2">
                                        {todayBusy.map((slot) => (
                                            <li
                                                key={`${item.id}-${slot.start}-${slot.end}`}
                                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
                                            >
                                                {formatTime(slot.start)} -{" "}
                                                {formatTime(slot.end)}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <h2 className="text-xl font-semibold text-slate-900">
                        Area Weights
                    </h2>
                    {schedule.map((area) => (
                        <div
                            key={area.areaName}
                            className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                        >
                            <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
                                <h3 className="text-lg font-semibold text-slate-900">
                                    {area.areaName}
                                </h3>
                                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                                    Weight: {area.weight}
                                </span>
                            </div>

                            <div className="grid gap-2 sm:grid-cols-2">
                                {area.subareas.map((subarea) => (
                                    <div
                                        key={`${area.areaName}-${subarea.subareaName}`}
                                        className="rounded-lg border border-slate-200 bg-white px-4 py-3"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="font-medium text-slate-800">
                                                {subarea.subareaName}
                                            </p>
                                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                                Weight: {subarea.weight}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                        Which algorithm do you prefer?
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-slate-400">
                            <input
                                type="radio"
                                name="algorithm"
                                value="global"
                                checked={selectedAlgorithm === "global"}
                                onChange={(e) => {
                                    setSelectedAlgorithm(
                                        e.target.value as "global" | "nested",
                                    );
                                    setRescheduledData([]);
                                }}
                                className="h-4 w-4 cursor-pointer"
                            />
                            <div>
                                <p className="font-semibold text-slate-900">
                                    Global Weighted
                                </p>
                                <p className="text-xs text-slate-600">
                                    Allocates time based on all weights globally
                                </p>
                            </div>
                        </label>
                        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-slate-400">
                            <input
                                type="radio"
                                name="algorithm"
                                value="nested"
                                checked={selectedAlgorithm === "nested"}
                                onChange={(e) => {
                                    setSelectedAlgorithm(
                                        e.target.value as "global" | "nested",
                                    );
                                    setRescheduledData([]);
                                }}
                                className="h-4 w-4 cursor-pointer"
                            />
                            <div>
                                <p className="font-semibold text-slate-900">
                                    Nested Weighted
                                </p>
                                <p className="text-xs text-slate-600">
                                    Allocates time by area then subarea
                                </p>
                            </div>
                        </label>
                    </div>
                    <button
                        type="button"
                        onClick={handleReschedule}
                        className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"
                    >
                        Reschedule
                    </button>
                </div>

                {rescheduledData.length > 0 && (
                    <div className="space-y-6">
                        {selectedAlgorithm === "global" && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                                <h3 className="mb-4 text-lg font-semibold text-slate-900">
                                    Algorithm 1: Global Weighted Allocation
                                </h3>
                                <div className="space-y-3">
                                    {rescheduledData.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="rounded-xl border border-slate-200 bg-linear-to-r from-cyan-50 to-sky-50 px-4 py-3"
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <p className="text-sm text-slate-600">
                                                        <span className="font-semibold text-slate-900">
                                                            {item.subarea}
                                                        </span>
                                                        <span className="mx-2 text-slate-400">
                                                            •
                                                        </span>
                                                        <span className="text-slate-700">
                                                            {item.area}
                                                        </span>
                                                    </p>
                                                </div>
                                                <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-800">
                                                    {item.allocated} min
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700"
                                >
                                    Save this allocation
                                </button>
                            </div>
                        )}

                        {selectedAlgorithm === "nested" && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                                <h3 className="mb-4 text-lg font-semibold text-slate-900">
                                    Algorithm 2: Nested Weighted Allocation
                                </h3>
                                <div className="space-y-3">
                                    {rescheduledData.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="rounded-xl border border-slate-200 bg-linear-to-r from-emerald-50 to-lime-50 px-4 py-3"
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <p className="text-sm text-slate-600">
                                                        <span className="font-semibold text-slate-900">
                                                            {item.subarea}
                                                        </span>
                                                        <span className="mx-2 text-slate-400">
                                                            •
                                                        </span>
                                                        <span className="text-slate-700">
                                                            {item.area}
                                                        </span>
                                                    </p>
                                                </div>
                                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">
                                                    {item.allocated} min
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700"
                                >
                                    Save this allocation
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {finalSchedule.length > 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <h3 className="mb-4 text-lg font-semibold text-slate-900">
                            Final Schedule
                        </h3>
                        <div className="space-y-3">
                            {finalSchedule.map((slot, idx) => (
                                <div
                                    key={`${slot.subarea}-${slot.start}-${idx}`}
                                    className="rounded-xl border border-slate-200 bg-linear-to-r from-violet-50 to-indigo-50 px-4 py-3"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <p className="text-sm text-slate-600">
                                                <span className="font-semibold text-slate-900">
                                                    {slot.subarea}
                                                </span>
                                                <span className="mx-2 text-slate-400">
                                                    •
                                                </span>
                                                <span className="text-slate-700">
                                                    {slot.area}
                                                </span>
                                            </p>
                                            <p className="mt-1 text-sm font-medium text-slate-800">
                                                {formatTime(slot.start)} -{" "}
                                                {formatTime(slot.end)}
                                            </p>
                                        </div>
                                        <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-800">
                                            {slot.minutes} min
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
