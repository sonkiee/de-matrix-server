import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { yupload } from "../middleware/upload.middleware";
import bannerModel from "../models/banner.model";

export const getBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.query;

    let banners;
    if (type) {
      banners = await bannerModel.findOne({ type });
      if (!banners) {
        res.status(404).json({ message: `No ${type} banner found` });
        return;
      }
    } else {
      banners = await bannerModel.find();

      if (banners.length === 0) {
        res.status(404).json({ message: "No banners uploaded" });
        return;
      }
    }

    res.status(200).json({ banners });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const uploadBanner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { type, title, description } = req.body;

    if (!type) {
      res.status(400).json({ message: "Please provide a banner type" });
      return;
    }

    if (!["small", "big"].includes(type)) {
      res
        .status(400)
        .json({ message: "Invalid banner type. Choose 'small' or 'big'." });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: "Please upload a banner image" });
      return;
    }

    const existing = await bannerModel.findOne({ type });

    if (existing) {
      const filePath = path.join(
        __dirname,
        "..",
        "public",
        "uploads",
        existing.imageUrl
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      existing.imageUrl = `/uploads/${req.file.filename}`;
      existing.title = title || existing.title;
      existing.description = description || existing.description;
      await existing.save();

      res.status(200).json({ message: "Banner updated successfully" });
      return;
    }

    const banner = await bannerModel.create({
      type,
      imageUrl: `/uploads/${req.file.filename}`,
      title,
      description,
    });

    res.status(201).json({ message: "Banner uploaded successfully", banner });
    return;
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    return;
  }
};
