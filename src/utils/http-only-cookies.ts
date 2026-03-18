import { Response } from "express";
import "dotenv/config";

const NODE_ENV = process.env.NODE_ENV;
const isProduction = NODE_ENV === "production";

const options = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? "none" : "lax") as
    | "lax"
    | "strict"
    | "none"
    | boolean
    | undefined,
  domain: isProduction ? ".dappertech.org" : undefined,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const cookie = {
  set: (res: Response, token: string) => {
    res.cookie("access_token", token, options);
  },
  clear: (res: Response) => {
    res.clearCookie("access_token", options);
  },
};
