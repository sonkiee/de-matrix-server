import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { verify } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  console.log("backend", token);

  if (!token) {
    console.warn("Auth middleware: No token found in request.");
    res.status(401).json({ message: "Verily, You must be logged in" });
    return;
  }

  try {
    const decoded = verify(token) as { id: string };
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
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as an admin" });
  }
};
// Compare this snippet from src/controllers/payment.controller.ts:
