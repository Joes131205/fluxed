import { eq } from "drizzle-orm";
import { db, refresh_tokens } from "..";
import type { NewRefreshToken } from "../schema";

export const storeRefreshToken = async (token: NewRefreshToken) => {
    const [result] = await db.insert(refresh_tokens).values(token).returning();
    return result;
};

export const getRefreshToken = async (token: string) => {
    const [result] = await db
        .select()
        .from(refresh_tokens)
        .where(eq(refresh_tokens.token, token));
    return result;
};

export const revokeToken = async (token: string) => {
    const [result] = await db
        .update(refresh_tokens)
        .set({ revoked_at: new Date() })
        .where(eq(refresh_tokens.token, token))
        .returning();
    return result;
};
