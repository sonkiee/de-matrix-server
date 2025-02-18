import express, { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

export const initializePayment = async (req: AuthRequest, res: Response) => {
  const user = req.user;
  const { amount, currency, payment_method, description } = req.body;
  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transaction/initialize",
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  };
  try {
  } catch (error) {}
};
