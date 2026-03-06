import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const refresh_tokens = pgTable("refresh_tokens", {
    token: text("token").primaryKey(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    user_id: uuid("user_id")
        .references(() => users.id, {
            onDelete: "cascade",
        })
        .notNull(),
    expires_at: timestamp("expires_at").notNull(),
    revoked_at: timestamp("revoked_at"),
});

export type NewRefreshToken = typeof refresh_tokens.$inferInsert;
