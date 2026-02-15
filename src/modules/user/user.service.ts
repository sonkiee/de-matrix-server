import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";

export class UserService {
  constructor() {}

  findById = async (id: string) => {
    return await db.query.users.findFirst({
      where: eq(users.id, id),
    });
  };

  findByEmail = async (email: string) => {
    return await db.query.users.findFirst({
      where: eq(users.email, email),
    });
  };
}
