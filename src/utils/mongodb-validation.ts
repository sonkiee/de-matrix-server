import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

// Utility function to check if a string is a valid MongoDB ObjectId
export const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Middleware to validate MongoDB ObjectId
export const validateObjectId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({
      message: "Invalid ID format",
      details: "The provided ID must be a valid MongoDB ObjectId",
    });
    return;
  }

  next();
};
