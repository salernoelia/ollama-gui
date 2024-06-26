import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: text("timestamp").default(sql`CURRENT_TIMESTAMP`),
});

export const chats = sqliteTable("chats", {
  id: integer("id").primaryKey(),
  userId: integer("user_id"),
  message: text("message"),
  createdAt: text("timestamp").default(sql`CURRENT_TIMESTAMP`),
});

// For select queries
export type User = typeof users.$inferSelect;
export type Chat = typeof chats.$inferSelect;

// For insert queries
export type InsertUser = typeof users.$inferInsert;
export type InsertChat = typeof chats.$inferInsert;
