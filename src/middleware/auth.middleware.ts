import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verify } from "../utils/jwt";
import { db } from "../db";
import { Request, User } from "../types/request";

function getToken(req: any): string | undefined {
  const cookieToken = req.cookies?.token;
  if (cookieToken) return cookieToken;

  const authHeader = req.headers?.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return undefined;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = getToken(req);

  if (!token) {
    res.status(401).json({ message: "Verily, You must be logged in" });
    return;
  }

  try {
    const decoded = verify(token) as { id: string };
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, decoded.id),
    });

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    const authUser: User = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      isVerified: user.isVerified,
    };
    req.user = authUser;
    next();
    return;
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
};

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") return next();
  res.status(403).json({ message: "Admin access required" });
};
