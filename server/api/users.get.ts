//server/api/users.get.ts
import { users } from "../../db/schema";
import { db } from "../sqlite-service";

export default defineEventHandler(async (event) => {
  try {
    const result = await db.select().from(users).all();
    return { users: result };
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      statusMessage: e.message,
    });
  }
});
