import express, { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import axios from "axios";
import orderModel from "../models/order.model";
import paymentModel from "../models/payment.model";
import mongoose from "mongoose";
import { Product } from "../models/product.model";

export const initializePayment = async (req: AuthRequest, res: Response) => {
  const user = req.user;
  const { orderId } = req.body;

  if (!orderId) {
    res.status(400).json({
      message: "Missing OrderId",
    });
    return;
  }

  const orderIdStr = String(orderId);

  if (!mongoose.Types.ObjectId.isValid(orderIdStr)) {
    res.status(400).json({ message: "Invalid category ID" });
    return;
  }

  try {
    // Ensure all required fields are provided
    const order = await orderModel.findById(orderId);
    if (!order) {
      res.status(400).json({ message: "Order not found" });
      return;
    }

    // if (!order.reference) {
    //   order.reference = new mongoose.Types.ObjectId().toString();
    //   await order.save();
    // }

    // Make the API request to Paystack
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        amount: order.totalAmount * 100,
        currency: "NGN", // Currency code
        email: user.email, // Assuming user has an email
        reference: order.reference,
        metadata: {
          orderId: order._id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    await paymentModel.create({
      user: user._id,
      order: order._id,
      reference: response.data.data.reference,
      amount: order.totalAmount,
      status: "pending",
    });

    for (const item of order.products) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(400).json({ message: `Product ${item.product} not found` });
        return;
      }
      product.stock -= item.quantity;
      await product.save();
    }

    order.reference = response.data.data.reference;
    await order.save();
    res.status(200).json({ data: response.data });
  } catch (error) {
    console.error("Paystack Initialization Error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while initializing payment", error });
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

    if (response.data.data.status === "success") {
      const { reference } = response.data.data;

      const order = await orderModel.findOne({
        reference: reference,
      });

      if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
      }
      order.paymentStatus = "paid";
      order.status = "processing";
      await order.save();

      const payment = await paymentModel.findOne({ reference });

      if (!payment) {
        // If no existing payment record, create one
        await paymentModel.create({
          user: order.user,
          order: order._id,
          reference,
          status: "paid",
          amount: order.totalAmount / 100, // Convert kobo to Naira if needed
        });
      } else {
        // Update existing payment record
        payment.status = "paid";
        await payment.save();
      }

      res.status(200).json({ message: "Payment successful", order });
    } else {
      res.status(400).json({ message: "Payment failed" });
    }

    // Handle Paystack's successful response
    // console.log(response);
    // res.status(200).json({ data: response.data });
  } catch (error) {
    console.error("Paystack Verification Error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while verifying payment" });
    return;
  }
};

export const paymentWebhook = async (req: Request, res: Response) => {
  const event = req.body;

  if (!event) {
    res.status(400).json({
      message: "Invalid webhook payload",
    });
    return;
  }

  try {
    if (event.event === "charge.success") {
      const { reference, amount } = event.data;

      const order = await orderModel.findOne({ reference });

      if (!order) {
        console.error(`Order not found for reference ${reference}`);
        res.status(404).json({
          message: "Order not found",
        });
        return;
      }

      order.paymentStatus = "paid";
      order.status = "processing";
      await order.save();

      const payment = await paymentModel.findOne({ reference });

      if (!payment) {
        await paymentModel.create({
          user: order.user,
          order: order._id,
          reference,
          status: "paid",
          amount: order.totalAmount / 100,
        });
      } else {
        payment.status = "paid";
        await payment.save();
      }
      console.log(`Payment verifeif for order ${order._id}`);
      res.status(200).json({
        message: "Payment processed successfully",
      });
    } else {
      res.status(400).json({
        message: "Event not handled",
      });
    }
  } catch (error) {
    console.error("Webhook Handling Error", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
