import express, { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import axios from "axios";
export const initializePayment = async (req: AuthRequest, res: Response) => {
  const user = req.user;
  const { amount, currency, payment_method, description } = req.body;

  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        amount,
        currency,
        payment_method,
        description,
        email: user.email,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    return;
  }
};
