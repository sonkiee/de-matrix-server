import { NextFunction, Request, Response } from "express";
import logger from "../config/logger";
import { ZodError } from "zod";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ZodError) {
    logger.warn(`Validation error: ${JSON.stringify(err.issues, null, 2)}`);

    const fields: Record<string, string> = {};

    for (const issue of err.issues) {
      const field = issue.path.join(".") || "body";
      if (!fields[field]) fields[field] = issue.message;
    }

    return res.status(400).json({
      // message: "Validation error",
      ...fields,
    });
  }

  const statusCode = res.statusCode < 400 ? 500 : res.statusCode;

  const meta = {
    message: err?.message,
    method: req.method,
    path: req.originalUrl,
    // stack: err?.stack,
  };

  // Always log full details on the server
  logger.error(`Unhandled error:\n${JSON.stringify(meta, null, 2)}`);

  const isProduction = process.env.NODE_ENV === "production";

  // Client response
  return res.status(statusCode).json({
    method: req.method,
    message: isProduction
      ? "Internal server error"
      : err?.message || "Internal server error",
  });
};
