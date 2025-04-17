import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import categoryModel from "../models/category.model";
import { Product } from "../models/product.model";

export const newCategory = async (req: AuthRequest, res: Response) => {
  const { name } = req.body;
  try {
    if (!name) {
      res.status(400).json({ message: "Please enter all fields" });
      return;
    }
    const existingCategory = await categoryModel.findOne({
      name,
    });
    if (existingCategory) {
      res.status(400).json({ message: "Category already exists" });
      return;
    }
    const category = await categoryModel.create({
      name,
    });
    res.status(201).json({
      success: true,
      message: `Category ${category} created successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    const categories = await categoryModel.find();

    if (categories.length === 0) {
      res.status(404).json({ message: "No categories found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Categories retrived successfully",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getCategoryById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const category = await categoryModel.findById(id).populate("products");

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    const products = await Product.find({ category: id });
    category.products = products;
    res.status(200).json({ category });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getCategoryByName = async (req: AuthRequest, res: Response) => {
  const { name } = req.params;
  try {
    const category = await categoryModel.findOne({ name }).populate("products");
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    const products = await Product.find({ category: category._id });
    category.products = products;
    res.status(200).json({ category });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    return;
  }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    if (!name) {
      res.status(400).json({ message: "Please enter all fields" });
      return;
    }
    const category = await categoryModel.findById(id);
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    await category
      .updateOne({
        name,
      })
      .exec();
    res.status(200).json({ message: "Category updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
