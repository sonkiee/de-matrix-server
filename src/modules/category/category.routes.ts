import express from "express";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";

const router = express.Router();

const categoryController = new CategoryController(new CategoryService());

router.get("/", categoryController.getCategories);
// router.get("/:id", getCategoryById);
// router.get("/name/:name", getCategoryByName);

export default router;
