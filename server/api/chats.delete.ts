import { eq } from "drizzle-orm";
import { chats } from "../../db/schema";
import { db } from "../sqlite-service";

export default defineEventHandler(async (event) => {
  try {
    const { id } = await readBody(event);

    if (id === undefined || id === 0 || id === null) {
      throw createError({
        statusCode: 400,
        statusMessage: "Chat ID is required",
      });
    }

    // Check if the chat ID exists
    const existingChat = await db
      .select()
      .from(chats)
      .where(eq(chats.id, id))
      .execute();
    if (existingChat.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Chat not found",
      });
    }

    // Perform the delete operation
    const result = await db.delete(chats).where(eq(chats.id, id)).execute();

    return {
      message: `Chat with ID ${id} deleted successfully`,
      result: result,
    };
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      statusMessage: e.message,
    });
  }
});
