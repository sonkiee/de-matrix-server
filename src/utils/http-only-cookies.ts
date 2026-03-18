import { Response } from "express";
import dotenv from "dotenv";
import { tr } from "zod/v4/locales";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV;

const isProduction = NODE_ENV === "production";

export const set = (res: Response, token: string) => {
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    domain: isProduction ? ".dappertech.org" : undefined,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: "/",
  });
};

export const clear = (res: Response) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    domain: isProduction ? ".dappertech.org" : undefined,
    path: "/",
  });
};
