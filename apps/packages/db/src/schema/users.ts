import {
    integer,
    pgTable,
    time,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

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
    startTime: time("start_time", { withTimezone: false })
        .notNull()
        .default("09:00"),
    endTime: time("end_time", { withTimezone: false })
        .notNull()
        .default("23:59"),
    minDuration: integer("min_duration").default(15),
});

export type NewUser = typeof users.$inferInsert;
