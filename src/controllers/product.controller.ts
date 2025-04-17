import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { uploadToR2 } from "../config/r2config";
import categoryModel from "../models/category.model";
import mongoose from "mongoose";
import { Product } from "../models/product.model";

export const createProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { name, description, price, category, stock, images, colors, sizes } =
    req.body;
  const files = req.files as Express.Multer.File[] | undefined;
  try {
    if (!name || !description || !price || !category || !stock) {
      res.status(400).json({ message: "Please enter all fields" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      res.status(400).json({ message: "Invalid category ID" });
      return;
    }

    const existingCategory = await categoryModel.findById(category);
    if (!existingCategory) {
      res.status(400).json({ message: "Category does not exist in store" });
      return;
    }

    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      res
        .status(400)
        .json({ message: "A product with this name already exists." });
      return;
    }

    if (!files || files.length === 0) {
      res.status(400).json({ message: "Please uplaod atleast one image" });
      return;
    }

    const imageUrls = await Promise.all(files.map((file) => uploadToR2(file)));

    const colorsArray = Array.isArray(colors)
      ? colors
      : colors.split(",").map((c: string) => c.trim());
    const sizesArray = Array.isArray(sizes)
      ? sizes
      : sizes.split(",").map((s: string) => s.trim());

    const product = await Product.create({
      name,
      description,
      price,
      category: existingCategory,
      stock,
      images: imageUrls,
      colors: colorsArray,
      sizes: sizesArray,
    });
    res.status(201).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    return;
  }
};

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const filter = req.query.filter;
    let query = {};
    if (filter === "featured") query = { isFeatured: true };
    if (filter === "bestseller") query = { isBestSeller: true };

    const products = await Product.find(query);

    if (products && products.length === 0) {
      res.status(404).json({ message: "No products found" });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
    return;
  }
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    return;
  }
};

export const updateProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { name, description, price, category, stock, images, colors, sizes } =
    req.body;
  const { id } = req.params;
  try {
    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock || product.stock;
    product.images = images || product.images;
    product.colors = colors || product.colors;
    product.sizes = sizes || product.sizes;

    await product.save();
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    return;
  }
};

export const deleteProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    return;
  }
};
