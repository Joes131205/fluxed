
export const FinalScheduleList = ({
    rescheduled,
    final,
    selectedAlgo,
    onSave,
}: any) => {
    if (final.length === 0) return null;



    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold">
                    Allocation Results ({selectedAlgo})
                </h3>
                <div className="space-y-3 mb-6">
                    {rescheduled.map((item: any, idx: number) => (
                        <div key={idx} className="...">
                            {item.subarea} • {item.area} — {item.allocated} min
                        </div>
                    ))}
                </div>

                <h3 className="mb-4 text-lg font-semibold">Timeline</h3>
                <div className="space-y-3">
                    {final.map((slot: any, idx: number) => (
                        <div
                            key={idx}
                            className="bg-linear-to-r from-violet-50 to-indigo-50 ..."
                        >
                            <p className="font-bold">{slot.subarea}</p>
                            <p className="text-sm">
                                {new Date(slot.start).toLocaleTimeString()} -{" "}
                                {new Date(slot.end).toLocaleTimeString()}
                            </p>
                        </div>
                    ))}
                </div>
                <button
                    onClick={onSave}
                    className="w-full mt-6 bg-slate-900 text-white p-3 rounded-xl"
                >
                    Save to Database
                </button>
            </div>
        </div>
    );
};
