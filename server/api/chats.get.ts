//server/api/chats.put.ts
import { integer } from "drizzle-orm/pg-core";
import { chats } from "../../db/schema";
import { db } from "../sqlite-service";

export default defineEventHandler(async (event) => {
  try {
    const result = await db
      .select({ id: chats.id, name: chats.name, date: chats.createdAt })
      .from(chats)
      .all();
    return { chats: result };
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      statusMessage: e.message,
    });
  }
});
