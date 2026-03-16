import { eq } from "drizzle-orm";
import { db } from "../../db";
import { Brand, brands } from "../../db/schema";

export class BrandService {
  constructor() {}

  list = async (): Promise<Brand[]> => {
    return db.query.brands.findMany({
      orderBy: (c, { desc }) => [desc(c.createdAt)],
    });
  };

  findBySlug = async (slug: string) => {
    return await db.query.brands.findFirst({
      where: eq(brands.slug, slug),
    });
  };

  findById = async (id: string) => {
    return await db.query.brands.findFirst({
      where: eq(brands.id, id),
    });
  };

  create = async (name: string, slug: string) => {
    const [brand] = await db.insert(brands).values({ name, slug }).returning();
    if (!brand) throw new Error("Failed to create brand");
    return brand;
  };
}
