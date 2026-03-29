export const AreaWeightsDisplay = ({ schedule }: { schedule: any[] }) => {
    if (!schedule.length) return null;

    return (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-semibold text-slate-900 font-display">
                Current Priorities
            </h2>
            <div className="grid gap-4">
                {schedule.map((area) => (
                    <div
                        key={area.areaId}
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
                            {area.subareas.map((subarea: any) => (
                                <div
                                    key={subarea.subareaId}
                                    className="rounded-lg border border-slate-200 bg-white px-4 py-3"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="font-medium text-slate-800 text-sm">
                                            {subarea.subareaName}
                                        </p>
                                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                            w: {subarea.weight}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
