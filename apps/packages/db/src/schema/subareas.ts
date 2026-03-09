import {
    boolean,
    integer,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { areas } from "./areas";

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
    name: varchar("name", { length: 256 }).notNull(),
    weight: integer("weight").default(1),
});

export type NewSubareas = typeof subareas.$inferInsert;
