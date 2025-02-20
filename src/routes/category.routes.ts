import express from "express";
import {
  newCategory,
  getCategories,
  getCategoryById,
  getCategoryByName,
} from "../controllers/category.controller";

const router = express.Router();

router.get("/", getCategories);
router.post("/new", newCategory);
router.get("/:id", getCategoryById);
router.get("/name/:name", getCategoryByName);

export default router;
