export const StatsCards = ({
    calendarCount,
    freeMinutes,
    plannedCount,
}: any) => (
    <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Synced Calendars
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
                {calendarCount}
            </p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Free Time Today
            </p>
            <p className="mt-2 text-2xl font-bold text-emerald-900">
                {freeMinutes} min
            </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                Planned Slots
            </p>
            <p className="mt-2 text-2xl font-bold text-amber-900">
                {plannedCount}
            </p>
        </div>
    </div>
);
