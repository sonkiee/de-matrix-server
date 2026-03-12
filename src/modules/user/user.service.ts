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

  updateProfile = async (
    id: string,
    data: Partial<{ firstName: string; lastName: string; phone: string }>,
  ) => {
    const user = await this.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser = {
      ...user,
      ...data,
    };

    await db.update(users).set(updatedUser).where(eq(users.id, id));
    return updatedUser;
  };
}
