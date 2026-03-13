import type { Event } from "@app/shared/types";
import React from "react";

type EventProp = {
    event: Event;
};

const EventCard: React.FC<EventProp> = ({ event }) => {
    return (
        <div className="flex items-start gap-3 rounded-md bg-white border border-gray-100 px-3 py-2.5 shadow-xs">
            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-green-400" />
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">
                    {event.name ?? "Untitled event"}
                </p>
                {(event.startTime || event.endTime) && (
                    <p className="text-xs text-gray-400 mt-0.5">
                        {event.startTime}
                        {event.startTime && event.endTime && " — "}
                        {event.endTime}
                    </p>
                )}
                {event.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {event.description}
                    </p>
                )}
            </div>
        </div>
    );
};

export default EventCard;
