import { useAreas } from "@/hooks/useAreas";
import {
    calcGlobalWeightedTime,
    calcNestedWeightedTime,
} from "@/utils/reschedule";
import { client, subareasClient } from "@/lib/client";
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
            },
            {
                subareaName: "Design",
                weight: 2,
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
            },
            {
                subareaName: "Sleep",
                weight: 5,
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
            },
            {
                subareaName: "Social",
                weight: 2,
            },
        ],
    },
];

function RouteComponent() {
    const [minutes, setMinutes] = useState<number>(0);
    const [schedule, setSchedule] = useState([]);
    const [rescheduledData1, setRescheduledData1] = useState([]);
    const [rescheduledData2, setRescheduledData2] = useState([]);

    const [loading, setLoading] = useState(false);
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

    const handleReschedule = () => {
        const rescheduled1 = calcGlobalWeightedTime(schedule, minutes);
        const rescheduled2 = calcNestedWeightedTime(schedule, minutes);

        setRescheduledData1(rescheduled1);
        setRescheduledData2(rescheduled2);
    };

    const handleSave = async () => {
        console.log(rescheduledData1);
        for (let i = 0; i < rescheduledData1.length; i++) {
            const data = rescheduledData1[i];
            await client.api.subareas[":id"].$put(
                {
                    json: {
                        id: data.id,
                        name: data.subarea,
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
        console.log("saved");
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

                {rescheduledData1.length > 0 && (
                    <div className="space-y-6">
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                Algorithm 1: Global Weighted Allocation
                            </h3>
                            <div className="space-y-3">
                                {rescheduledData1.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-lg border border-gray-100 bg-gradient-to-r from-blue-50 to-blue-50 px-4 py-3"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium text-gray-900">
                                                        {item.subarea}
                                                    </span>
                                                    <span className="mx-2 text-gray-400">
                                                        •
                                                    </span>
                                                    <span className="text-gray-700">
                                                        {item.area}
                                                    </span>
                                                </p>
                                            </div>
                                            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                                                {item.allocated} min
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={handleSave}
                                className="w-full rounded-lg bg-green-600 px-4 py-3 font-medium text-white transition hover:bg-green-700"
                            >
                                I prefer this
                            </button>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                Algorithm 2: Nested Weighted Allocation
                            </h3>
                            <div className="space-y-3">
                                {rescheduledData2.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-lg border border-gray-100 bg-gradient-to-r from-green-50 to-green-50 px-4 py-3"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium text-gray-900">
                                                        {item.subarea}
                                                    </span>
                                                    <span className="mx-2 text-gray-400">
                                                        •
                                                    </span>
                                                    <span className="text-gray-700">
                                                        {item.area}
                                                    </span>
                                                </p>
                                            </div>
                                            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                                                {item.allocated} min
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={handleSave}
                                className="w-full rounded-lg bg-green-600 px-4 py-3 font-medium text-white transition hover:bg-green-700"
                            >
                                I prefer this
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
