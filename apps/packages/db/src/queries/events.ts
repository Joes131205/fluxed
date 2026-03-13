import { eq } from "drizzle-orm";
import { db, events } from "..";
import type { NewEvents } from "../schema";

export const createEvent = async (event: NewEvents) => {
    const [result] = await db.insert(events).values(event).returning();
    return result;
};

export const getEventsBySubarea = async (subareaId: string) => {
    const results = await db
        .select()
        .from(events)
        .where(eq(events.subarea_id, subareaId));

    return results;
};

export const updateEvent = async (eventId: string, event: NewEvents) => {
    const [result] = await db
        .update(events)
        .set(event)
        .where(eq(events.id, eventId))
        .returning();

    return result;
};

export const deleteEvent = async (eventId: string) => {
    await db.delete(events).where(eq(events.id, eventId));
};
