import { Response } from "express";
import dotenv from "dotenv";
import { tr } from "zod/v4/locales";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV;

export const set = (res: Response, token: string) => {
  const isProduction = NODE_ENV === "production";
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: true, // Always set secure to true for production
    sameSite: "none", // Always set sameSite to 'none' for production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: "/",
  });
};

export const clear = (res: Response) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: true, // Always set secure to true for production
    sameSite: "none", // Always set sameSite to 'none' for production
    path: "/",
  });
};
