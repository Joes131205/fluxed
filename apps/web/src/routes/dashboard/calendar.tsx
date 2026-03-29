import { useCalendarEngine } from "@/hooks/useCalendarsHelper";
import { requireAuth } from "@/utils/requireAuth";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

// Sub-components
import { StatsCards } from "../../components/calendar/StatsCards";
import { BusyTimeSection } from "../../components/calendar/BusyTimeSection";
import { AreaWeightsDisplay } from "../../components/calendar/AreaWeightsDisplay";
import { AlgorithmSelector } from "../../components/calendar/AlgorithmSelector";
import { FinalScheduleList } from "../../components/calendar/FinalScheduleList";

export const Route = createFileRoute("/dashboard/calendar")({
    beforeLoad: requireAuth,
    component: RouteComponent,
});

function RouteComponent() {
    const {
        calendar,
        minutes,
        rescheduledData,
        finalSchedule,
        isLoading,
        actions,
        error,
        schedule,
        user,
    } = useCalendarEngine();

    const [selectedAlgorithm, setSelectedAlgorithm] = useState<
        "global" | "nested"
    >("global");

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
                        </div>
                        <div
                            className={`${user?.googleId ? "block" : "hidden"}`}
                        >
                            <button
                                onClick={actions.getData}
                                disabled={isLoading}
                                className="..."
                            >
                                {isLoading ? "Syncing..." : "Sync Calendar"}
                            </button>
                        </div>
                    </div>
                    {error && <p className="mt-4 text-rose-700">{error}</p>}
                </div>

                <StatsCards
                    calendarCount={calendar.length}
                    freeMinutes={minutes}
                    plannedCount={rescheduledData.length}
                />

                <BusyTimeSection
                    user={user}
                    calendar={calendar}
                    onAdd={actions.addManualEvent}
                    onRemove={actions.removeManualEvent}
                />

                <AreaWeightsDisplay schedule={schedule} />

                <AlgorithmSelector
                    selected={selectedAlgorithm}
                    setSelected={setSelectedAlgorithm}
                    onReschedule={() =>
                        actions.runReschedule(selectedAlgorithm)
                    }
                />

                <FinalScheduleList
                    rescheduled={rescheduledData}
                    final={finalSchedule}
                    selectedAlgo={selectedAlgorithm}
                    onSave={actions.saveToDatabase}
                />
            </div>
        </div>
    );
}
