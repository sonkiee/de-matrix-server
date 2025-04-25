import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode < 400 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    // stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });

  // if (process.env.NODE_ENV !== "production") {
  //   console.error(err.stack);
  // }
};
