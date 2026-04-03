import { env } from "@/env";
import { useAuth } from "@/hooks/useAuth";
import { getAuthHeaders } from "@/lib/authHeaders";
import { usersClient } from "@/lib/client";
import { requireAuth } from "@/utils/requireAuth";
import { createFileRoute } from "@tanstack/react-router";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/dashboard/settings")({
    beforeLoad: requireAuth,
    component: RouteComponent,
});

function RouteComponent() {
    const { user } = useAuth();

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [minDuration, setMinDuration] = useState(0);
    const [timeBuffer, setTimeBuffer] = useState(0);

    const handleSave = async () => {
        await usersClient.time.$put(
            {
                json: {
                    startTime,
                    endTime,
                    minDuration,
                    timeBuffer,
                },
            },
            {
                headers: getAuthHeaders,
            },
        );
    };

    useEffect(() => {
        setStartTime(user?.startTime!);
        setEndTime(user?.endTime!);
        setMinDuration(user?.minDuration!);
        setTimeBuffer(user?.timeBuffer!);
    }, [user]);

    return (
        <div className="min-h-screen ">
            <div className="max-w-2xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Settings
                    </h1>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    <form
                        className="p-8 space-y-8"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSave();
                        }}
                    >
                        <div className="space-y-6">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="startTime">
                                    When do you start the day / start the
                                    routine?
                                </Label>
                                <Input
                                    id="startTime"
                                    type="time"
                                    value={startTime}
                                    onChange={(e) =>
                                        setStartTime(e.target.value)
                                    }
                                />
                                <span className="text-xs text-gray-500">
                                    Current: {startTime || "Not set"}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="endTime">
                                    When do you finish the day?
                                </Label>
                                <Input
                                    id="endTime"
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                                <span className="text-xs text-gray-500">
                                    Current: {endTime || "Not set"}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="minDuration">
                                    What's the task duration minimum?
                                </Label>
                                <Input
                                    id="minDuration"
                                    type="number"
                                    value={minDuration}
                                    onChange={(e) =>
                                        setMinDuration(Number(e.target.value))
                                    }
                                    min={0}
                                />
                                <span className="text-xs text-gray-500">
                                    Current: {minDuration || "Not set"}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="minDuration">
                                    What's the time buffer between events?
                                </Label>
                                <Input
                                    id="timeBuffer"
                                    type="number"
                                    value={timeBuffer}
                                    onChange={(e) =>
                                        setTimeBuffer(Number(e.target.value))
                                    }
                                    min={0}
                                />
                                <span className="text-xs text-gray-500">
                                    Current: {timeBuffer || "Not set"}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <Button type="submit" className="px-8">
                                Save
                            </Button>
                        </div>
                    </form>
                    <div className="px-8 pb-8">
                        <div className="mt-8">
                            <div className="flex items-center gap-3">
                                <span className="font-medium text-gray-700">
                                    Google Account:
                                </span>
                                {user?.googleId ? (
                                    <span className="text-green-600 font-semibold">
                                        Linked
                                    </span>
                                ) : (
                                    <span className="text-red-500 font-semibold">
                                        Not Linked
                                    </span>
                                )}
                            </div>
                            {user?.googleId ? (
                                <div className="text-xs text-gray-500 mt-1">
                                    {user.googleId}
                                </div>
                            ) : (
                                <a
                                    href={
                                        env.VITE_API_URL +
                                        "/api/auth/google/start"
                                    }
                                    className="inline-block mt-2 text-blue-600 hover:underline text-sm font-medium"
                                >
                                    Link Google
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
