import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  username: text("username"),
  password: text("password"),
  port: integer("port"),
  systemTemplate: text("system_template"),
  seed: text("seed"),
  temperature: integer("temperature"),
  topP: integer("topP"),
  topK: integer("topK"),
  contextAmount: integer("contextAmount"),
  selectedModel: text("selectedModel"),
});

// Chat History
interface Content {
  date: string;
  role: string;
  content: string;
  model?: string;
}

export const chats = sqliteTable("chats", {
  id: integer("id").primaryKey(),
  chatName: text("chatName"),
  createdAt: text("timestamp").default(sql`CURRENT_TIMESTAMP`),
  userId: integer("user_id"),
  content: text("content", { mode: "json" })
    .notNull()
    .$type<Content[]>()
    .default(sql`(json_array())`),
});

// For select queries
export type User = typeof users.$inferSelect;
export type Chat = typeof chats.$inferSelect;

// For insert queries
export type InsertUser = typeof users.$inferInsert;
export type InsertChat = {
  id: number;
  chatName?: string | null | undefined;
  createdAt?: string | null | undefined;
  userId?: number | null | undefined;
  content: Content[] | undefined;
};
