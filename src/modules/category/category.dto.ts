// category.dto.ts
import type { NewCategory } from "../../db/schema/category.schema";

export type CreateCategoryInput = Pick<
  NewCategory,
  "name" | "description" | "isActive"
>;

export type UpdateCategoryInput = Pick<
  NewCategory,
  "name" | "description" | "isActive"
>;
