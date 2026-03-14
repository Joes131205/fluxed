import { useAreas } from "@/hooks/useAreas";
import {
    calcGlobalWeightedTime,
    calcNestedWeightedTime,
} from "@/utils/reschedule";
import { subareasClient } from "@/lib/client";
import { getAuthHeaders } from "@/lib/authHeaders";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/dashboard/reschedule/")({
    component: RouteComponent,
});

const mockData = [
    {
        areaName: "Work",
        weight: 5,
        subareas: [
            {
                subareaName: "Development",
                weight: 4,
                events: [
                    {
                        name: "Code Review",
                        description: "Review PR #1234",
                        startTime: new Date("2024-03-11T09:00:00"),
                        endTime: new Date("2024-03-11T09:30:00"),
                        isHardLocked: false,
                    },
                    {
                        name: "Team Meeting",
                        description: "Sprint planning",
                        startTime: new Date("2024-03-11T10:00:00"),
                        endTime: new Date("2024-03-11T11:00:00"),
                        isHardLocked: true,
                    },
                ],
            },
            {
                subareaName: "Design",
                weight: 2,
                events: [
                    {
                        name: "Design System Update",
                        description: null,
                        startTime: new Date("2024-03-11T14:00:00"),
                        endTime: new Date("2024-03-11T15:00:00"),
                        isHardLocked: false,
                    },
                ],
            },
        ],
    },
    {
        areaName: "Health",
        weight: 4,
        subareas: [
            {
                subareaName: "Exercise",
                weight: 3,
                events: [
                    {
                        name: "Gym",
                        description: "Chest & Back",
                        startTime: new Date("2024-03-11T06:00:00"),
                        endTime: new Date("2024-03-11T07:00:00"),
                        isHardLocked: false,
                    },
                ],
            },
            {
                subareaName: "Sleep",
                weight: 5,
                events: [],
            },
        ],
    },
    {
        areaName: "Personal",
        weight: 3,
        subareas: [
            {
                subareaName: "Learning",
                weight: 3,
                events: [
                    {
                        name: "Read Book",
                        description: "Atomic Habits",
                        startTime: new Date("2024-03-11T19:00:00"),
                        endTime: new Date("2024-03-11T20:00:00"),
                        isHardLocked: false,
                    },
                ],
            },
            {
                subareaName: "Social",
                weight: 2,
                events: [],
            },
        ],
    },
];

function RouteComponent() {
    const [minutes, setMinutes] = useState<number>(0);
    const [schedule, setSchedule] = useState([]);
    const [rescheduledData, setRescheduledData] = useState([]);
    const { data: areasData } = useAreas();

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
                        areaName: area.name,
                        subareas: (subareaData.data || []).map(
                            (subarea: any) => ({
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

    const handleReschedule = () => {
        const rescheduled1 = calcGlobalWeightedTime(schedule, minutes);
        const rescheduled2 = calcNestedWeightedTime(schedule, minutes);

        console.log(rescheduled1, rescheduled2);
    };
    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="mx-auto max-w-4xl space-y-8">
                <div className="space-y-2">
                    <p className="text-3xl font-bold text-gray-900">
                        Is your structure derailed?
                    </p>
                    <p className="text-gray-600">Don't fret! We gotchu fam!</p>
                    <p className="text-sm text-gray-500">
                        Using mock data for now.
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <label
                        htmlFor="minutes"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        How many minutes do you have left?
                    </label>
                    <input
                        id="minutes"
                        type="number"
                        onChange={(e) => setMinutes(Number(e.target.value))}
                        value={minutes}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500"
                    />
                </div>

                <div className="space-y-4">
                    {schedule.map((area) => (
                        <div
                            key={area.areaName}
                            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                        >
                            <div className="mb-4 flex items-center justify-between gap-3 border-b border-gray-100 pb-3">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {area.areaName}
                                </h2>
                                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                                    Weight: {area.weight}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {area.subareas.map((subarea) => (
                                    <div
                                        key={`${area.areaName}-${subarea.subareaName}`}
                                        className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="font-medium text-gray-800">
                                                {subarea.subareaName}
                                            </p>
                                            <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700">
                                                Weight: {subarea.weight}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={handleReschedule}
                    className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
                >
                    Reschedule
                </button>
            </div>
        </div>
    );
}
