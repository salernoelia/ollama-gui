import { eq } from "drizzle-orm";
import { chats, type InsertChat } from "../../../db/schema";
import { db } from "../../sqlite-service";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const updatedChat: InsertChat = {
      ...body,
    };

    const chatID = event.context.params?.id;

    if (!chatID) {
      throw createError({
        statusCode: 400,
        statusMessage: "Chat ID is required",
      });
    }

    const chatIDNumber = Number(chatID);

    if (
      chatIDNumber === undefined ||
      chatIDNumber === 0 ||
      chatIDNumber === null ||
      typeof chatIDNumber !== "number"
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: "Chat ID is required",
      });
    }

    // Check if the chat ID exists
    const existingChat = await db
      .select()
      .from(chats)
      .where(eq(chats.id, chatIDNumber))
      .execute();
    if (existingChat.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Chat not found",
      });
    }

    const result = await db
      .update(chats)
      .set({ name: updatedChat.name, content: updatedChat.content })
      .where(eq(chats.id, chatIDNumber))
      .execute();

    return { updatedChat: updatedChat, result: result };
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      statusMessage: e.message,
    });
  }
});
