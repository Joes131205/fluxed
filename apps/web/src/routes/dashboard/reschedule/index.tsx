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

function RouteComponent() {
    const [minutes, setMinutes] = useState<number>(0);
    const [schedule, setSchedule] = useState<
        {
            areaId: string;
            areaName: string;
            weight: number;
            subareas: {
                subareaId: string;
                subareaName: string;
                weight: number;
            }[];
        }[]
    >([]);
    const [rescheduledData, setRescheduledData] = useState<
        {
            area: string;
            id: string;
            subarea: string;
            weight: number;
            allocated: number;
        }[]
    >([]);

    const [selectedAlgorithm, setSelectedAlgorithm] = useState<
        "global" | "nested"
    >("global");
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

    console.log(schedule);

    const handleReschedule = () => {
        const rescheduled =
            selectedAlgorithm === "global"
                ? calcGlobalWeightedTime(schedule, minutes)
                : calcNestedWeightedTime(schedule, minutes);
        setRescheduledData(rescheduled);
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
                        min={0}
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

                <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">
                        Which algorithm do you prefer?
                    </p>
                    <div className="flex gap-4">
                        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 transition hover:border-blue-400">
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
                                <p className="font-medium text-gray-900">
                                    Global Weighted
                                </p>
                                <p className="text-xs text-gray-500">
                                    Allocates time based on all weights globally
                                </p>
                            </div>
                        </label>
                        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 transition hover:border-green-400">
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
                                <p className="font-medium text-gray-900">
                                    Nested Weighted
                                </p>
                                <p className="text-xs text-gray-500">
                                    Allocates time by area then subarea
                                </p>
                            </div>
                        </label>
                    </div>
                    <button
                        type="button"
                        onClick={handleReschedule}
                        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700"
                    >
                        Reschedule
                    </button>
                </div>
                {rescheduledData.length > 0 && (
                    <div className="space-y-6">
                        {selectedAlgorithm === "global" && (
                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                    Algorithm 1: Global Weighted Allocation
                                </h3>
                                <div className="space-y-3">
                                    {rescheduledData.map((item, idx) => (
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
                                    Save this allocation
                                </button>
                            </div>
                        )}
                        {selectedAlgorithm === "nested" && (
                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                    Algorithm 2: Nested Weighted Allocation
                                </h3>
                                <div className="space-y-3">
                                    {rescheduledData.map((item, idx) => (
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
                                    Save this allocation
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
