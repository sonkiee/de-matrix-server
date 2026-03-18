import { Response, NextFunction, Request } from "express";
import { verify } from "../utils/jwt";
import { db } from "../db";

function getToken(req: any): string | undefined {
  return req.cookies?.access_token || req.headers?.authorization?.split(" ")[1];
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

    req.userId = user.id;
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") return next();
  return res.status(403).json({ message: "Admin access required" });
};
