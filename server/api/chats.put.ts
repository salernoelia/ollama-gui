//server/api/users.post.ts
import { chats, type InsertChat } from "../../db/schema";
import { db } from "../sqlite-service";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const updatedChat: InsertChat = {
      ...body,
    };
    const result = db.update(chats).set(updatedChat).execute();
    return { updatedChat: updatedChat, result: result };
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      statusMessage: e.message,
    });
  }
});
