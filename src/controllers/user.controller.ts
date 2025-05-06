import { Response } from "express";
import User from "../models/user.model";
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
    console.error("Server error", error);
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      res.status(404).json({ message: "User does not exist" });
      return;
    }
    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Server error", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const { fname, lname } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    user.fname = fname || user.fname;
    user.lname = lname || user.lname;
    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Server error", error);
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
