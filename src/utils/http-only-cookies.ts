import { Response } from "express";

export const set = (res: Response, token: string) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 1000,
  });
};
