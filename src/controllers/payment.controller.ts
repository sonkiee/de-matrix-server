import express, { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import axios from "axios";

export const initializePayment = async (req: AuthRequest, res: Response) => {
  const user = req.user; // Make sure user is attached from your authentication middleware
  //   const { amount, currency, payment_method, description } = req.body;

  const { amount } = req.body;

  // Ensure all required fields are provided
  if (!amount) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  try {
    // Make the API request to Paystack
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        amount, // Amount in kobo (or the smallest currency unit)
        currency: "NGN", // Currency code
        email: "annagu.kennedy@gmail.com", // Assuming user has an email
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

export const verifyPayment = async (req: AuthRequest, res: Response) => {
  const { reference, trxref } = req.query;

  // Ensure all required fields are provided
  if (!reference) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }
  try {
    // Make the API request to Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Handle Paystack's successful response
    console.log(response);
    res.status(200).json({ data: response.data });
  } catch (error) {
    console.error("Paystack Verification Error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while verifying payment" });
    return;
  }
};
