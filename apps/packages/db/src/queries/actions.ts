import { eq } from "drizzle-orm";
import { actions, db, type NewActions } from "..";

export const createAction = async (action: NewActions) => {
    const [result] = await db.insert(actions).values(action).returning();
    return result;
};

export const getAllActionsBySubarea = async (subareaId: string) => {
    const results = await db
        .select()
        .from(actions)
        .where(eq(actions.subarea_id, subareaId));
    return results;
};

export const updateAction = async (
    actionId: string,
    action: Partial<NewActions>,
) => {
    const [result] = await db
        .update(actions)
        .set(action)
        .where(eq(actions.id, actionId))
        .returning();

    return result;
};

export const deleteAction = async (actionId: string) => {
    await db.delete(actions).where(eq(actions.id, actionId));
};
