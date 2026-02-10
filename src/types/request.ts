import type { Request as ExpressRequest } from "express";

export type User = {
  id: string;
  email: string;
  fullName: string;
  role: "customer" | "admin";
  isVerified: boolean;
};

export interface Request extends ExpressRequest {
  user?: User;
}
