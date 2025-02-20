import productModel from "../models/product.model";
import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

import { uploadToR2 } from "../config/r2config";

export const createProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { name, description, price, category, stock, images, colors, sizes } =
    req.body;
  const files = req.files as Express.Multer.File[];
  try {
    if (!name || !description || !price || !category || !stock) {
      res.status(400).json({ message: "Please enter all fields" });
      return;
    }

    if (!files || files.length === 0) {
      res.status(400).json({ message: "Please uplaod atleast one image" });
      return;
    }

    const product = await productModel.create({
      name,
      description,
      price,
      category,
      stock,
      images,
      colors,
      sizes,
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
    const products = await productModel.find();

    if (products && products.length === 0) {
      res.status(404).json({ message: "No products found" });
      return;
    }
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    return;
  }
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const product = await productModel.findById(id);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json({ product });
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
    const product = await productModel.findById(id);

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
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    return;
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const product = await productModel.findById(id);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    await product.remove();
    res.status(200).json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    return;
  }
};
