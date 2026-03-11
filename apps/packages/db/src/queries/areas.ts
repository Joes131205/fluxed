import { eq } from "drizzle-orm";
import { areas, db } from "..";
import type { NewAreas } from "../schema";

export const createArea = async (area: NewAreas) => {
    const [result] = await db.insert(areas).values(area).returning();
    return result;
};

export const getAreas = async (userId: string) => {
    const results = await db
        .select()
        .from(areas)
        .where(eq(areas.user_id, userId));
    return results;
};

export const updateArea = async (areaId: string, area: NewAreas) => {
    const [result] = await db
        .update(areas)
        .set(area)
        .where(eq(areas.id, areaId))
        .returning();

    return result;
};

export const deleteArea = async (areaId: string) => {
    await db.delete(areas).where(eq(areas.id, areaId));
};
