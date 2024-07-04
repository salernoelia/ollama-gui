import { chats } from "../../../db/schema";
import { db } from "../../sqlite-service";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    const chatsID = event.context.params?.id;

    if (!chatsID) {
      throw createError({
        statusCode: 400,
        statusMessage: "Chat ID is required",
      });
    }

    const chatIDNumber = Number(chatsID);

    if (isNaN(chatIDNumber)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid Chat ID",
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

    const chatsResponse = await db
      .select()
      .from(chats)
      .where(eq(chats.id, chatIDNumber))
      .get();
    return { chats: chatsResponse };
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      statusMessage: e.message,
    });
  }
});
