import { getAuthHeaders } from "@/lib/authHeaders";
import { calendarsClient } from "@/lib/client";
import { requireAuth } from "@/utils/requireAuth";
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

    type CalendarSyncResponse = {
        ok: boolean;
        calendarData?: CalendarItem[];
        error?: string;
    };

    const [calendar, setCalendar] = useState<CalendarItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            const data: CalendarSyncResponse = await response.json();

            if (!data.ok) {
                setCalendar([]);
                setError(data.error ?? "Unable to load calendar data");
                return;
            }

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
        handleGetData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            TODAY
                        </h1>
                        <p className="text-sm text-gray-600">
                            Showing only today&apos;s busy times from your
                            synced calendars.
                        </p>
                    </div>
                    <button
                        onClick={handleGetData}
                        disabled={isLoading}
                        className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                        {isLoading ? "Syncing..." : "Sync Data"}
                    </button>
                </div>

                {error && (
                    <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </p>
                )}

                {!isLoading && !error && calendar.length === 0 && (
                    <p className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
                        No calendars available.
                    </p>
                )}

                <div className="space-y-4">
                    {calendar.map((item) => {
                        const todayBusy = item.busy.filter(
                            (slot) => isToday(slot.start) || isToday(slot.end),
                        );

                        return (
                            <div
                                key={item.id}
                                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                            >
                                <h2 className="mb-3 text-lg font-semibold text-gray-900">
                                    {item.name}
                                </h2>

                                {todayBusy.length === 0 ? (
                                    <p className="text-sm text-gray-600">
                                        Free for the rest of today.
                                    </p>
                                ) : (
                                    <ul className="space-y-2">
                                        {todayBusy.map((slot) => (
                                            <li
                                                key={`${item.id}-${slot.start}-${slot.end}`}
                                                className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700"
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
            </div>
        </div>
    );
}
