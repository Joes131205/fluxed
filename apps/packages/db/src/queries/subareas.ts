import { eq } from "drizzle-orm";
import { db, subareas } from "..";
import type { SubareaInput } from "../../../shared/src/inputs";

export const createSubarea = async (subarea: SubareaInput) => {
    const [result] = await db.insert(subareas).values(subarea).returning();
    return result;
};

export const getSubareaByArea = async (areaId: string) => {
    const results = await db
        .select()
        .from(subareas)
        .where(eq(subareas.area_id, areaId));
    return results;
};

export const updateSubarea = async (
    subareaId: string,
    subarea: SubareaInput,
) => {
    const [result] = await db
        .update(subareas)
        .set(subarea)
        .where(eq(subareas.id, subareaId));
    return result;
};

export const deleteSubarea = async (subareaId: string) => {
    await db.delete(subareas).where(eq(subareas.id, subareaId));
};
