import type { Event } from "@app/shared/types";
import React from "react";

type EventProp = {
    event: Event;
};

const EventCard: React.FC<EventProp> = ({ event }) => {
    return (
        <div>
            <p>{event.name}</p>
        </div>
    );
};

export default EventCard;
