// category.service.ts
import { db } from "../../db";
import { categories } from "../../db/schema/category.schema";
import { eq } from "drizzle-orm";
import type { Category } from "../../db/schema/category.schema";
import { CreateCategoryInput, UpdateCategoryInput } from "./category.dto";

const slugify = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "-");

export class CategoryService {
  findById = async (id: string): Promise<Category | undefined> => {
    return db.query.categories.findFirst({
      where: eq(categories.id, id),
    });
  };

  findBySlug = async (slug: string): Promise<Category | undefined> => {
    return db.query.categories.findFirst({
      where: eq(categories.slug, slug),
    });
  };

  findByName = async (
    name: Category["name"],
  ): Promise<Category | undefined> => {
    return db.query.categories.findFirst({
      where: eq(categories.name, name),
    });
  };

  list = async (): Promise<Category[]> => {
    return db.query.categories.findMany({
      orderBy: (c, { desc }) => [desc(c.createdAt)],
    });
  };

  create = async (input: CreateCategoryInput): Promise<Category> => {
    const slug = slugify(String(input.name)); // enum name -> string

    const [created] = await db
      .insert(categories)
      .values({
        ...input,
        slug,
      })
      .returning();

    if (!created) throw new Error("Failed to create category");
    return created;
  };

  update = async (
    id: string,
    input: UpdateCategoryInput,
  ): Promise<Category> => {
    const slug = slugify(String(input.name));

    const [updated] = await db
      .update(categories)
      .set({
        ...input,
        slug,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id))
      .returning();

    if (!updated) throw new Error("Category not found");
    return updated;
  };
}
