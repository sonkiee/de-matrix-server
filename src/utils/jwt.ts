import jwt from "jsonwebtoken";
import { User } from "../db/schema";

export const sign = (payload: User) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

export const verify = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};
