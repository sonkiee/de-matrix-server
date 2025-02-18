import express, { Request, Response } from "express";
import orderModel from "../models/order.model";
import productModel from "../models/product.model";
import { AuthRequest } from "../middleware/auth.middleware";

export const orders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await orderModel.find();
    if (orders.length === 0) {
      res.status(404).json({ message: "No orders found" });
      return;
    }
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    return;
  }
};

export const orderById = async (req: AuthRequest, res: Response) => {
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

export const getOrders = async (
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

export const newOrder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const user = req.user._id;
  try {
    if (!orderItems || orderItems.length === 0) {
      res.status(400).json({ message: "No order items" });
    }

    const products = await Promise.all(
      orderItems.map(async (item: any) => {
        const product = await productModel.findById(item.product);
        if (!product) {
          throw new Error(`Product not found: ${item.product}`);
        }

        const price = product.price;
        return {
          product: product._id,
          name: product.name,
          price,
          image: product.image,
          countInStock: product.countInStock,
          quantity: item.quantity,
        };
      })
    );

    const totalAmount = itemsPrice + taxPrice + shippingPrice;

    const order = await orderModel.create({
      user,
      orderItems: products,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      totalAmount,
    });

    const createdOrder = await order.save();
    res.status(201).json({ createdOrder });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    return;
  }
};
