import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";

export default class AuthService {
  constructor() {}

  async findByEmail(email: string) {
    return await db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  async findById(id: string) {
    return await db.query.users.findFirst({
      where: eq(users.id, id),
    });
  }
}
