import type { Subarea } from "@app/shared/types";
import React from "react";

type SubareaProp = {
    subarea: Subarea;
};

const SubareaCard: React.FC<SubareaProp> = ({ subarea }) => {
    const weightValue = subarea.weight ?? 0;

    return (
        <div className="flex flex-col gap-3 bg-white p-4 rounded-2xl border-2 border-border min-w-[180px] flex-1">
            <div className="space-y-0.5">
                <p className="text-[9px] font-black uppercase tracking-widest text-text/20 leading-none">
                    Subarea
                </p>
                <h4 className="text-sm font-black tracking-tight text-text">
                    {subarea.name.toUpperCase()}
                </h4>
            </div>

            <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-text/40">
                        Weight
                    </p>
                    <span className="text-[11px] font-black text-accent">
                        {weightValue}/5
                    </span>
                </div>

                <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 flex-1 rounded-full border-b-2 transition-colors duration-300 ${
                                i < weightValue
                                    ? "bg-accent border-accent/20 shadow-[0_2px_0_0_#16bc1030]"
                                    : "bg-secondary border-transparent"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubareaCard;
