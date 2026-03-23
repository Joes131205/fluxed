import { eq } from "drizzle-orm";
import { db, plannedSessions } from "..";
import type { NewPlannedSessions } from "../schema";

export const updatePlan = async (planned: NewPlannedSessions) => {
    await db.insert(plannedSessions).values(planned);
};

export const deletePlan = async (userId: string) => {
    await db.delete(plannedSessions).where(eq(plannedSessions.user_id, userId));
};

export const getPlan = async (userId: string) => {
    const [result] = await db
        .select()
        .from(plannedSessions)
        .where(eq(plannedSessions.user_id, userId));
    return result;
};
