// category.controller.ts
import type { NextFunction, Request, Response } from "express";
import type { CreateCategoryInput, UpdateCategoryInput } from "./category.dto";
import { CategoryService } from "./category.service";
import { categories as categoriesTable } from "../../db/schema/category.schema";
import { eq } from "drizzle-orm";
import { db } from "../../db";

type IdParams = { id: string };
type SlugParams = { slug: string };

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  newCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as CreateCategoryInput;

      if (!body?.name) {
        res.status(400).json({ message: "name is required" });
        return;
      }

      const existingByName = await this.categoryService.findByName(body.name);
      if (existingByName) {
        res.status(409).json({ message: "Category already exists" });
        return;
      }

      const created = await this.categoryService.create(body);

      res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: created,
      });
    } catch (err) {
      next(err);
    }
  };

  getCategories = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.categoryService.list();

      if (data.length === 0) {
        res.status(404).json({ message: "No categories found" });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Categories retrieved successfully",
        data,
      });
    } catch (err) {
      next(err);
    }
  };

  getCategoryById = async (
    req: Request<IdParams>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;

      const category = await this.categoryService.findById(id);
      if (!category) {
        res.status(404).json({ message: "Category not found" });
        return;
      }

      // OPTIONAL: if you want products included (like mongoose populate)
      const withProducts = await db.query.categories.findFirst({
        where: eq(categoriesTable.id, id),
        with: { products: true },
      });

      res.status(200).json({ category: withProducts ?? category });
    } catch (err) {
      next(err);
    }
  };

  getCategoryBySlug = async (
    req: Request<SlugParams>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { slug } = req.params;

      const category = await this.categoryService.findBySlug(slug);
      if (!category) {
        res.status(404).json({ message: "Category not found" });
        return;
      }

      const withProducts = await db.query.categories.findFirst({
        where: eq(categoriesTable.slug, slug),
        with: { products: true },
      });

      res.status(200).json({ category: withProducts ?? category });
    } catch (err) {
      next(err);
    }
  };

  updateCategory = async (
    req: Request<IdParams>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const body = req.body as UpdateCategoryInput;

      if (!body?.name) {
        res.status(400).json({ message: "name is required" });
        return;
      }

      const existing = await this.categoryService.findById(id);
      if (!existing) {
        res.status(404).json({ message: "Category not found" });
        return;
      }

      // prevent duplicate name on another row
      const dup = await this.categoryService.findByName(body.name);
      if (dup && dup.id !== id) {
        res.status(409).json({ message: "Category name already exists" });
        return;
      }

      const updated = await this.categoryService.update(id, body);

      res.status(200).json({
        success: true,
        message: "Category updated",
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  };
}
