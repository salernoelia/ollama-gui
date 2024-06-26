//server/api/users.post.ts
import { users, type InsertUser } from "../../db/schema";
import { db } from "../sqlite-service";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const updatedUser: InsertUser = {
      ...body,
    };
    const result = db.update(users).set(updatedUser).execute();
    return { updatedUser: updatedUser, result: result };
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      statusMessage: e.message,
    });
  }
});
