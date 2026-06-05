import {
    boolean,
    date,
    integer,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { areas } from "./areas";
import { users } from "./users";

export const subareas = pgTable("subareas", {
    id: uuid("id").primaryKey().defaultRandom(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    area_id: uuid("area_id")
        .references(() => areas.id, {
            onDelete: "cascade",
        })
        .notNull(),
    user_id: uuid("user_id")
        .references(() => users.id, {
            onDelete: "cascade",
        })
        .notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    description: varchar("description", { length: 256 }),
    weight: integer("weight").default(1),
    allocatedMinutes: integer("allocated_minutes").default(0),
    startTime: timestamp("start_time"),
    endTime: timestamp("end_time"),
    color: varchar("color", { length: 7 }).default("#00cdfd").notNull(),
});

export type NewSubareas = typeof subareas.$inferInsert;
