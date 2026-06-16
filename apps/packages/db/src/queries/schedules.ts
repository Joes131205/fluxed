import { and, eq } from "drizzle-orm";
import { db, schedules, type NewSchedules } from "..";

export const createSchedule = async (schedule: NewSchedules) => {
    const [result] = await db.insert(schedules).values(schedule).returning();
    return result;
};

export const getSchedulesByUser = async (userId: string) => {
    const results = await db
        .select()
        .from(schedules)
        .where(eq(schedules.user_id, userId));
    return results;
};

export const updateSchedule = async (
    id: string,
    userId: string,
    data: Partial<NewSchedules>,
) => {
    const [result] = await db
        .update(schedules)
        .set(data)
        .where(and(eq(schedules.id, id), eq(schedules.user_id, userId)))
        .returning();

    return result;
};

export const deleteSchedule = async (id: string, userId: string) => {
    await db
        .delete(schedules)
        .where(and(eq(schedules.id, id), eq(schedules.user_id, userId)));
};
