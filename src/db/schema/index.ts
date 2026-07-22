import { pgTable, serial, varchar, timestamp, date, jsonb, pgSchema } from "drizzle-orm/pg-core";

export const shiftSchema = pgSchema("shifty_schema");

// Baseline schema for connectivity check
export const users = shiftSchema.table("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Saved shift rotations
export const savedRotations = shiftSchema.table("saved_rotations", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  startDate: date("start_date").notNull(),
  pattern: jsonb("pattern").$type<("work" | "off")[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
