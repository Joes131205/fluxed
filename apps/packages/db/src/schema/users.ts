import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    email: varchar("email", { length: 256 }).unique().notNull(),
    username: varchar("username", { length: 256 }).unique().notNull(),
    password: varchar("password", { length: 256 }),
    googleRefreshToken: varchar("google_refresh_token", { length: 256 }),
    googleId: varchar("google_id", { length: 256 }),
});

export type NewUser = typeof users.$inferInsert;
