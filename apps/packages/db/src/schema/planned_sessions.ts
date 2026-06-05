import {
    integer,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { subareas } from "./subareas";
import { users } from "./users";

export const plannedSessions = pgTable("planned_sessions", {
    id: uuid("id").primaryKey().defaultRandom(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    subarea_id: uuid("subarea_id")
        .references(() => subareas.id, {
            onDelete: "cascade",
        })
        .notNull(),
    user_id: uuid("user_id")
        .references(() => users.id, {
            onDelete: "cascade",
        })
        .notNull(),
    detail: varchar("detail", { length: 256 }),
    start_time: timestamp("start_time").notNull(),
    end_time: timestamp("end_time").notNull(),
    minutes: integer("minutes").notNull(),
});

export type NewPlannedSessions = typeof plannedSessions.$inferInsert;
