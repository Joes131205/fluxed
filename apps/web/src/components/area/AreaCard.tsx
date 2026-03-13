import type { Area } from "@app/shared/types";
import React from "react";
import SubareaList from "../subarea/SubareaList";

type AreaProp = {
    area: Area;
};

const AreaCard: React.FC<AreaProp> = ({ area }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {area.name}
                </h3>
                {area.weight != null && (
                    <span className="ml-3 shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        Weight: {area.weight}
                    </span>
                )}
            </div>
            <div className="px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                    Subareas
                </p>
                <SubareaList areaId={area.id} />
            </div>
        </div>
    );
};

export default AreaCard;
