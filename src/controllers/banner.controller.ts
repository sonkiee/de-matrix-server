import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { yupload } from "../middleware/upload.middleware";

export const uploadBanner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { type, title, description } = req.body;

    if (!req.file) {
      res.status(400).json({ message: "Please upload a banner image" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    return;
  }
};
