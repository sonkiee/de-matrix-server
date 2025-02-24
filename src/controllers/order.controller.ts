import express, { Request, Response } from "express";
import orderModel from "../models/order.model";
import productModel from "../models/product.model";
import { AuthRequest } from "../middleware/auth.middleware";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await orderModel.find();
    if (orders.length === 0) {
      res.status(404).json({ message: "No orders found" });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    return;
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const order = await orderModel.findById(id);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Order details retrieved successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    return;
  }
};

export const getUserOrders = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const orders = await orderModel.find({ user: req.user._id });
    if (!orders) {
      res.status(404).json({ message: "No orders found" });
      return;
    }
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    return;
  }
};

export const getUserOrderById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const order = await orderModel.findById(id);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    return;
  }
};

export const newOrder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { products, shippingAddress } = req.body;

  const user = req.user._id;
  try {
    if (!products || !shippingAddress) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    if (!Array.isArray(products)) {
      res.status(400).json({ message: "please provide an Array of products" });
      return;
    }

    let totalAmount = 0;
    const orderProducts = [];

    for (const item of products) {
      if (!item.productId) {
        res.status(400).json({
          message: "Each product must have productId",
        });
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        res
          .status(400)
          .json({ message: `Invalid product ID: ${item.productId}` });
        return;
      }
      const product = await productModel.findById(item.productId);

      if (!product) {
        res
          .status(404)
          .json({ message: `Product with ID ${item.productId} not found` });
        return;
      }

      if (product.stock < item.quantity) {
        res
          .status(400)
          .json({ message: `Product ${product.name} is out of stock` });
        return;
      }

      totalAmount += product.price * item.quantity;
      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const order = await orderModel.create({
      user,
      products: orderProducts,
      totalAmount,
      shippingAddress,
      reference: uuidv4(),
      status: "pending",
      paymentStatus: "pending",
    });

    const createdOrder = await order.save();
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: createdOrder,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    return;
  }
};
