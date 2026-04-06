import type { Area } from "@app/shared/types";
import React, { useState } from "react";
import SubareaList from "../subarea/SubareaList";

type AreaProp = {
    area: Area;
};

const AreaCard: React.FC<AreaProp> = ({ area }) => {
    const [isOpened, setIsOpened] = useState(false);

    return (
        <div
            className={`
            group rounded-2xl border-2 transition-all bg-white duration-200 overflow-hidden
            ${isOpened ? "border-primary shadow-lg" : "border-border bg-secondary/20 hover:border-primary/30"}
        `}
        >
            <div
                className="flex items-center justify-between p-5 cursor-pointer select-none"
                onClick={() => setIsOpened(!isOpened)}
            >
                <div className="flex gap-8 items-center">
                    <div className="space-y-0.5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-text/30">
                            Area
                        </p>
                        <h3 className="text-xl font-black tracking-tighter text-text transition-colors">
                            {area.name.toUpperCase()}
                        </h3>
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-text/30">
                            Weight
                        </p>
                        <div className="flex items-center gap-1.5">
                            <span className="text-lg font-black text-primary">
                                {area.weight}
                            </span>
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 w-3 rounded-full ${i < area.weight! ? "bg-primary" : "bg-primary/10"}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Playful Chevron */}
                <div
                    className={`transition-transform duration-300 ${isOpened ? "rotate-180" : ""}`}
                >
                    <svg
                        className="w-5 h-5 text-text/20"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            </div>

            <div
                className={`
                transition-all duration-300 ease-in-out
                ${isOpened ? "max-h-[1000px] border-t-2 border-border" : "max-h-0"}
            `}
            >
                <div className="p-5 bg-background/50">
                    <SubareaList areaId={area.id} />
                </div>
            </div>
        </div>
    );
};

export default AreaCard;
