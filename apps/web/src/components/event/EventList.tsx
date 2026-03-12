import type { Event } from "@app/shared/types";
import React from "react";
import EventCard from "./EventCard";
import { useEvents } from "@/hooks/useEvents";

type EventListProp = {
    subareaId: string;
};

const EventList: React.FC<EventListProp> = ({ subareaId }) => {
    const { data: events }: { data: Event[] } = useEvents(subareaId);

    return (
        <div className="flex flex-col gap-3">
            {events.map((event) => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
    );
};

export default EventList;
