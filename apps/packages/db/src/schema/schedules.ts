import {
    integer,
    jsonb,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";

type TimeSlot = {
    start: string;
    end: string;
};

export const schedules = pgTable("schedules", {
    id: uuid("id").primaryKey().defaultRandom(),
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
    name: varchar("name").notNull(),
    timeSlots: jsonb("time_slots").$type<TimeSlot[]>().default([]).notNull(),
});

export type NewSchedules = typeof schedules.$inferInsert;
