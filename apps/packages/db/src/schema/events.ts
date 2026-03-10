import {
    boolean,
    integer,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { areas } from "./areas";

export const events = pgTable("events", {
    id: uuid("id").primaryKey().defaultRandom(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    subarea_id: uuid("subarea_id").references(() => areas.id),
    name: varchar("name", { length: 255 }).default("Event"),
    description: varchar("description", { length: 255 }),
    startTime: timestamp("start_time"),
    endTime: timestamp("end_time"),
    isHardLocked: boolean("is_hard_locked").default(false),
});

export type NewEvents = typeof events.$inferInsert;
