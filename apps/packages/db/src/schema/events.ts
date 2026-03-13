import {
    boolean,
    integer,
    pgTable,
    time,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { areas } from "./areas";
import { subareas } from "./subareas";

export const events = pgTable("events", {
    id: uuid("id").primaryKey().defaultRandom(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    subarea_id: uuid("subarea_id").references(() => subareas.id),
    name: varchar("name", { length: 255 }).default("Event"),
    description: varchar("description", { length: 255 }),
    startTime: time("start_time"),
    endTime: time("end_time"),
    isHardLocked: boolean("is_hard_locked").default(false),
});

export type NewEvents = typeof events.$inferInsert;
