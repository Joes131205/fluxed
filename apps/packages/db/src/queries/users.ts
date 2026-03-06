import { eq } from "drizzle-orm";
import { db } from "..";
import { type NewUser, users } from "..";

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
    const [result] = await db.select().from(users).where(eq(users.id, userId));
    return result;
};

export const updateUser = async (
    userId: string,
    email: string,
    password: string,
) => {
    const [result] = await db
        .update(users)
        .set({
            email,
            password,
        })
        .where(eq(users.id, userId))
        .returning();
    return result;
};
