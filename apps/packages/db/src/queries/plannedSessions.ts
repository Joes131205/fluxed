import { eq } from "drizzle-orm";
import { areas, db, plannedSessions, subareas } from "..";
import type { NewPlannedSessions } from "../schema";

export const updatePlan = async (planned: NewPlannedSessions[]) => {
    await db.insert(plannedSessions).values(planned);
};

export const deletePlan = async (userId: string) => {
    await db.delete(plannedSessions).where(eq(plannedSessions.user_id, userId));
};

export const getPlan = async (userId: string) => {
    const results = await db
        .select({
            id: plannedSessions.id,
            sessionId: plannedSessions.id,
            startTime: plannedSessions.start_time,
            endTime: plannedSessions.end_time,
            minutes: plannedSessions.minutes,
            subareaId: subareas.id,
            subareaName: subareas.name,
            subareaWeight: subareas.weight,
            areaName: areas.name,
        })
        .from(plannedSessions)
        .innerJoin(subareas, eq(plannedSessions.subarea_id, subareas.id))
        .innerJoin(areas, eq(subareas.area_id, areas.id))
        .where(eq(plannedSessions.user_id, userId));
    console.log(results);
    return results;
};
