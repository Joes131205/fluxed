import { useAuth } from "@/hooks/useAuth";
import { getAuthHeaders } from "@/lib/authHeaders";
import { usersClient } from "@/lib/client";
import { requireAuth } from "@/utils/requireAuth";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/dashboard/settings")({
    beforeLoad: requireAuth,
    component: RouteComponent,
});

function RouteComponent() {
    const { user } = useAuth();

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [minDuration, setMinDuration] = useState(0);
    const handleSave = async () => {
        await usersClient.time.$put(
            {
                json: {
                    startTime,
                    endTime,
                    minDuration,
                },
            },
            {
                headers: getAuthHeaders,
            },
        );
    };

    useEffect(() => {
        console.log(user);
        console.log(user?.startTime, user?.endTime);
        setStartTime(user?.startTime!);
        setEndTime(user?.endTime!);
        setMinDuration(user?.minDuration!);
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Settings
                    </h1>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <div className="space-y-8">
                            <div>
                                <label
                                    htmlFor="startTime"
                                    className="block text-sm font-semibold text-gray-900 mb-3"
                                >
                                    When do you start the day / start the
                                    routine?
                                </label>
                                <input
                                    id="startTime"
                                    type="time"
                                    onChange={(e) =>
                                        setStartTime(e.target.value)
                                    }
                                    value={startTime}
                                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:ring-1 outline-none transition-colors"
                                />
                                <p className="mt-2 text-sm text-gray-500">
                                    Current: {startTime || "Not set"}
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="endTime"
                                    className="block text-sm font-semibold text-gray-900 mb-3"
                                >
                                    When do you finish the day?
                                </label>
                                <input
                                    id="endTime"
                                    type="time"
                                    onChange={(e) => setEndTime(e.target.value)}
                                    value={endTime}
                                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:ring-1 outline-none transition-colors"
                                />
                                <p className="mt-2 text-sm text-gray-500">
                                    Current: {endTime || "Not set"}
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="endTime"
                                    className="block text-sm font-semibold text-gray-900 mb-3"
                                >
                                    What's the task duration minimum?
                                </label>
                                <input
                                    id="minDuration"
                                    type="number"
                                    onChange={(e) =>
                                        setMinDuration(Number(e.target.value))
                                    }
                                    value={minDuration}
                                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:ring-1 outline-none transition-colors"
                                />
                                <p className="mt-2 text-sm text-gray-500">
                                    Current: {minDuration || "Not set"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className="bg-gray-50 px-6 sm:px-8 py-4 flex justify-end gap-3 border-t border-gray-200">
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm"
                        >
                            Save Time
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
