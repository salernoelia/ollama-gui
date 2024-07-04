//server/api/users/[id].ts
import { users } from "../../../db/schema";
import { db } from "../../sqlite-service";
import { and, asc, desc, eq, gt, gte, lt, lte, not, or } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.params?.id;
    const usersResponse = db
      .select()
      .from(users)
      .where(eq(users.id, Number(userId)))
      .get();
    return { users: usersResponse };
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      statusMessage: e.message,
    });
  }
});
