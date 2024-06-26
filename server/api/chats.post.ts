//server/api/chats.put.ts
import { chats, type InsertChat } from "../../db/schema";
import { db } from "../sqlite-service";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const newChat: InsertChat = {
      ...body,
    };
    const result = db.insert(chats).values(newChat).execute();
    return { newChat: newChat, result: result };
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      statusMessage: e.message,
    });
  }
});
