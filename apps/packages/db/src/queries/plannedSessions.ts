import { eq } from "drizzle-orm";
import { db, plannedSessions } from "..";
import type { NewPlannedSessions } from "../schema";

export const updatePlan = async (
    userId: string,
    planned: NewPlannedSessions,
) => {
    await db.delete(plannedSessions).where(eq(plannedSessions.user_id, userId));
    const [result] = await db.insert(plannedSessions).values(planned);
    return result;
};

export const getPlan = async (userId: string) => {
    const [result] = await db
        .select()
        .from(plannedSessions)
        .where(eq(plannedSessions.user_id, userId));
    return result;
};
