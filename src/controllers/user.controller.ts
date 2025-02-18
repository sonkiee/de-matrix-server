import express, { Request, Response } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

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
    res.status(200).json({ token });
    return;
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    return;
  }
};
