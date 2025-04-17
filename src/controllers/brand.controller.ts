import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { Brand } from "../models/brand.model";

const create = async (req: AuthRequest, res: Response) => {
  const { name, description } = req.body;

  try {
    if (!name || !description) {
      res.status(400).json({ message: "Please enter all fields" });
      return;
    }

    const category = new Brand({
      name,
      description,
    });

    await category.save();

    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const toggle = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    brand.isActive = !brand.isActive;
    await brand.save();

    return res.status(200).json({
      message: `Brand ${
        brand.isActive ? "activated" : "deactivated"
      } successfully`,
      brand,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export { create, toggle };
