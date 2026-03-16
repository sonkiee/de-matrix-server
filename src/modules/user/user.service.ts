import { eq } from "drizzle-orm";
import { db } from "../../db";
import { NewUser, users } from "../../db/schema";

export class UserService {
  constructor() {}

  create = async (data: NewUser) => {
    // const [user] = await db.insert(users).values(data).returning();
    const [user] = await db
      .insert(users)
      .values({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email.toLowerCase().trim(),
        password: data.password,
      })
      .returning();
    return user;
  };

  list = async () => {
    return await db.query.users.findMany({
      orderBy: (u, { desc }) => [desc(u.createdAt)],
    });
  };

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
