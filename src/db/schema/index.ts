import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

// Baseline schema for connectivity check
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
