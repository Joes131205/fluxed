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
        <div className="space-y-6 rounded-[2rem] border-2 border-border bg-white p-6 shadow-sm">
            <header>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text/40">
                    Choose Your Style
                </p>
            </header>

            <div className="grid gap-4 sm:grid-cols-2">
                {/* Option 1: Global */}
                <button
                    type="button"
                    onClick={() => setSelected("global")}
                    className={`flex flex-col items-start gap-2 rounded-2xl border-2 p-5 text-left transition-all active:scale-95 ${
                        selected === "global"
                            ? "border-primary bg-secondary/50 shadow-[0_8px_0_0_#33beff30]"
                            : "border-border bg-transparent hover:border-primary/20"
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🌪️</span>
                        <p className="font-black tracking-tight text-text">
                            The Blender
                        </p>
                    </div>
                    <p className="text-xs font-bold text-text/50">
                        A smooth mix of all your tasks. Good for variety.
                    </p>
                </button>

                {/* Option 2: Nested */}
                <button
                    type="button"
                    onClick={() => setSelected("nested")}
                    className={`flex flex-col items-start gap-2 rounded-2xl border-2 p-5 text-left transition-all active:scale-95 ${
                        selected === "nested"
                            ? "border-accent bg-accent/5 shadow-[0_8px_0_0_#16bc1030]"
                            : "border-border bg-transparent hover:border-accent/20"
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🎯</span>
                        <p className="font-black tracking-tight text-text">
                            The Specialist
                        </p>
                    </div>
                    <p className="text-xs font-bold text-text/50">
                        Groups tasks by category. Best for deep focus sessions.
                    </p>
                </button>
            </div>

            <button
                type="button"
                onClick={onReschedule}
                className="group relative w-full overflow-hidden rounded-2xl bg-primary py-5 font-black uppercase tracking-widest text-white shadow-[0_6px_0_0_#289cd1] transition-all hover:brightness-105 active:translate-y-1 active:shadow-none"
            >
                🚀 Generate My Day
            </button>
        </div>
    );
};
