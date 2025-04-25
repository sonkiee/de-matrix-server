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
  let token;

  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401).json({ message: "You must be logged in" });
    return;
  }

  try {
    const decoded = verify(token) as { id: string };

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, invalid token" });
    return;
  }
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    next();
    return;
  } else {
    res.status(401).json({ message: "Not authorized as an admin" });
    return;
  }
};
// Compare this snippet from src/controllers/payment.controller.ts:
