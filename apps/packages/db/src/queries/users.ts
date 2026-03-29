import { eq, getTableColumns } from "drizzle-orm";
import { db } from "..";
import { type NewUser, users } from "..";

const { password, ...columnsWithoutPassword } = getTableColumns(users);

export const createUser = async (user: NewUser) => {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return result;
};

export const getUserByEmail = async (email: string) => {
    const [result] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
    return result;
};

export const getUserById = async (userId: string) => {
    const [result] = await db
        .select(columnsWithoutPassword)
        .from(users)
        .where(eq(users.id, userId));
    return result;
};

export const updateUser = async (userId: string, user: NewUser) => {
    const [result] = await db
        .update(users)
        .set(user)
        .where(eq(users.id, userId))
        .returning();
    return result;
};

export const updateTime = async (userId: string, time: any) => {
    await db.update(users).set(time).where(eq(users.id, userId));
};
