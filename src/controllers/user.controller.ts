import express, { Request, Response } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthRequest } from "../middleware/auth.middleware";

dotenv.config();

export const getUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: "User not found " });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User details retrieved successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error,
    });
    return;
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      res.status(400).json({ message: "Please enter all fields" });
      return;
    }
    const existingUser = await User.findOne({
      email,
    });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }
    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({ user });
    return;
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    return;
  }
};

export const login = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(400).json({ message: "Please enter all fields" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "User does not exist" });
      return;
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "30d",
    });
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        ...user,
        token,
      },
    });
    return;
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    return;
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const { name } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    user.name = name || user.name;
    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    res.status(200).json({ message: "Logged out" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
