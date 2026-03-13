import type { Subarea } from "@app/shared/types";
import React from "react";
import EventList from "../event/EventList";

type SubareaProp = {
    subarea: Subarea;
};

const SubareaCard: React.FC<SubareaProp> = ({ subarea }) => {
    return (
        <div className="rounded-lg border border-gray-100 bg-gray-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h4 className="text-sm font-semibold text-gray-800 truncate">
                    {subarea.name}
                </h4>
                {subarea.weight != null && (
                    <span className="ml-2 shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        Weight: {subarea.weight}
                    </span>
                )}
            </div>
            <div className="px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                    Events
                </p>
                <EventList subareaId={subarea.id} />
            </div>
        </div>
    );
};

export default SubareaCard;
