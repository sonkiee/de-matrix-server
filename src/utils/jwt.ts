import jwt from "jsonwebtoken";

export const sign = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

export const verify = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};
