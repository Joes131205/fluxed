import {
    boolean,
    integer,
    pgTable,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";
import { subareas } from "./subareas";

export const events = pgTable("events", {
    id: uuid("id").primaryKey().defaultRandom(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    subareaId: uuid("subarea_id").references(() => subareas.id),
    startTime: timestamp("start_time"),
    endTime: timestamp("end_time"),
    isHardLocked: boolean("is_hard_locked").default(false),
});

export type NewEvents = typeof events.$inferInsert;
