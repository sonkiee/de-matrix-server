import { NextFunction, Request, Response } from "express";
import logger from "../config/logger";
import { ZodError } from "zod";

export const methodNotAllowedHandler = (req: Request, res: Response) => {
  const error = `method ${req.method} not allowed on ${req.originalUrl}`;
  logger.warn(error);
  return res.status(405).json({
    message: error,
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  const error = `path not found for: ${req.method} ${req.originalUrl}`;
  logger.warn(error);
  return res.status(404).json({
    message: error,
  });
};

const isHttpError = (err: any) => typeof err?.statusCode === "number";

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

  // decide status
  const statusCode = isHttpError(err)
    ? err.statusCode
    : res.statusCode >= 400
      ? res.statusCode
      : 500;

  // request id for tracing
  const requestId = crypto.randomUUID();

  const meta = {
    statusCode,
    message: err?.message,
    cause: err?.cause,
    method: req.method,
    path: req.originalUrl,
    // stack: err?.stack,
    detail: err?.detail,
    constraint: err?.constraint,
    table: err?.table,
  };

  // Always log full details on the server
  logger.error(`Unhandled error:\n${JSON.stringify(meta, null, 2)}`);

  // client-safe message
  const clientMessage =
    statusCode >= 500
      ? "Internal server error"
      : (err?.message ?? "Request failed");

  // Client response
  return res.status(statusCode).json({
    method: req.method,
    message: clientMessage,
  });
};
