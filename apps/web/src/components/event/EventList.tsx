import type { Event } from "@app/shared/types";
import React from "react";
import EventCard from "./EventCard";
import { useEvents } from "@/hooks/useEvents";

type EventListProp = {
    subareaId: string;
};

const EventList: React.FC<EventListProp> = ({ subareaId }) => {
    const { data, isLoading, error } = useEvents(subareaId);
    console.log(data);
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error || !data || !("ok" in data) || !data.ok) {
        return <div>Error loading subareas.</div>;
    }
    if (data.data.length === 0) {
        return <p className="text-xs text-gray-400 italic">No events yet.</p>;
    }
    return (
        <div className="flex flex-col gap-1.5">
            {data.data.map((event) => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
    );
};

export default EventList;
