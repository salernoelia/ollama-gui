import { eq } from "drizzle-orm";
import { chats } from "../../../db/schema";
import { db } from "../../sqlite-service";

export default defineEventHandler(async (event) => {
  try {
    var chatID = event.context.params?.id;

    if (chatID === undefined || chatID === null || typeof chatID !== "string") {
      throw createError({
        statusCode: 400,
        statusMessage: "Chat ID is required",
      });
    }

    const result = db
      .delete(chats)
      .where(eq(chats.id, Number(chatID)))
      .execute();

    return {
      message: `Chat with ID ${chatID} deleted successfully`,
      result: result,
    };
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      statusMessage: e.message,
    });
  }
});
