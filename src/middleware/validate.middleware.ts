import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

export const validate = <T>(schema: ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        });
      }
      next(error);
    }
  };
};

// optional: validate params/query too
// export const validateQuery =
//   <T>(schema: ZodSchema<T>) =>
//   (req: Request, res: Response, next: NextFunction) => {
//     try {
//       req.query = schema.parse(req.query) as any;
//       next();
//     } catch (err) {
//       if (err instanceof ZodError) {
//         return res.status(400).json({
//           message: "Invalid query",
//           errors: err.issues.map((i) => ({
//             field: i.path.join("."),
//             message: i.message,
//           })),
//         });
//       }
//       next(err);
//     }
//   };
