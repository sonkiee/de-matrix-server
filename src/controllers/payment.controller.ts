import express, { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

export const initializePayment = async (req: AuthRequest, res: Response) => {
  const user = req.user;
  const { amount, currency, payment_method, description } = req.body;
  const options = {};
  try {
  } catch (error) {}
};
