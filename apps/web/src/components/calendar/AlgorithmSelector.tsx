interface AlgoProps {
    selected: "global" | "nested";
    setSelected: (val: "global" | "nested") => void;
    onReschedule: () => void;
}

export const AlgorithmSelector = ({
    selected,
    setSelected,
    onReschedule,
}: AlgoProps) => {
    return (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                Reschedule Logic
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
                <label
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                        selected === "global"
                            ? "border-emerald-500 bg-emerald-50/50"
                            : "border-slate-200 bg-slate-50 hover:border-slate-300"
                    }`}
                >
                    <input
                        type="radio"
                        name="algorithm"
                        value="global"
                        checked={selected === "global"}
                        onChange={(e) =>
                            setSelected(e.target.value as "global")
                        }
                        className="h-4 w-4 accent-emerald-600"
                    />
                    <div>
                        <p className="font-semibold text-slate-900">
                            Global Weighted
                        </p>
                        <p className="text-xs text-slate-600">
                            Pure balance across all subareas
                        </p>
                    </div>
                </label>

                <label
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                        selected === "nested"
                            ? "border-emerald-500 bg-emerald-50/50"
                            : "border-slate-200 bg-slate-50 hover:border-slate-300"
                    }`}
                >
                    <input
                        type="radio"
                        name="algorithm"
                        value="nested"
                        checked={selected === "nested"}
                        onChange={(e) =>
                            setSelected(e.target.value as "nested")
                        }
                        className="h-4 w-4 accent-emerald-600"
                    />
                    <div>
                        <p className="font-semibold text-slate-900">
                            Nested Weighted
                        </p>
                        <p className="text-xs text-slate-600">
                            Prioritize Area first, then Subarea
                        </p>
                    </div>
                </label>
            </div>

            <button
                type="button"
                onClick={onReschedule}
                className="w-full rounded-xl bg-emerald-600 px-4 py-4 font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98]"
            >
                Calculate Daily Plan
            </button>
        </div>
    );
};
