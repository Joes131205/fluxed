import {
    boolean,
    integer,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { subareas } from "./subareas";

export const actions = pgTable("actions", {
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
    title: varchar("title").notNull(),
    isCompleted: boolean("is_completed").default(false).notNull(),
});

export type NewActions = typeof actions.$inferInsert;
