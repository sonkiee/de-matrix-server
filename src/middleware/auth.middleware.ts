import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401).json({ message: "User not found" });
        return;
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, invalid token" });
      return;
    }
  } else {
    res.status(401).json({ message: "You must be logged in" });
    return;
  }
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as an admin" });
  }
};
// Compare this snippet from src/controllers/payment.controller.ts:
