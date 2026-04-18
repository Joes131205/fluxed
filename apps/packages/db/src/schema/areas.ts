import {
    integer,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const areas = pgTable("areas", {
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
    name: varchar("name", { length: 256 }).notNull(),
    color: varchar("color", { length: 7 }).default("#00cdfd").notNull(),
    weight: integer("weight").default(1),
});

export type NewAreas = typeof areas.$inferInsert;
