import express, { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import axios from "axios";

export const initializePayment = async (req: AuthRequest, res: Response) => {
  const user = req.user; // Make sure user is attached from your authentication middleware
  const { amount, currency, payment_method, description } = req.body;

  // Ensure all required fields are provided
  if (!amount || !currency || !payment_method || !description) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  try {
    // Make the API request to Paystack
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        amount, // Amount in kobo (or the smallest currency unit)
        currency,
        payment_method,
        description,
        email: user.email, // Assuming user has an email
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Handle Paystack's successful response
    res.status(200).json({ data: response.data });
  } catch (error) {
    console.error("Paystack Initialization Error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while initializing payment" });
    return;
  }
};
