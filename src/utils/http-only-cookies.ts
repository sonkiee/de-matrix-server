import { Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV;

export const set = (res: Response, token: string) => {
  const isProduction = NODE_ENV === "production";
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: isProduction ? true : false,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: "/",
  });
};

export const clear = (res: Response) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: NODE_ENV === "production" ? true : false,
    sameSite: NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
};
