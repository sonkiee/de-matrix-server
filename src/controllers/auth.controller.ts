import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import User from "../models/user.model";
import { set } from "../utils/http-only-cookies";
import { sign } from "../utils/jwt";

export const register = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { fname, lname, email, password } = req.body;
  try {
    if (!fname || !lname || !email || !password) {
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
      fname,
      lname,
      email,
      password,
    });

    const token = sign(user._id as string);
    set(res, token);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: { user },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error });
    return;
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const token = sign(user._id as string); // safest if your `sign` function accepts string
    set(res, token); // set token cookie

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error("Server error", error);
    res.status(500).json({ message: "Server error", error });
    return;
  }
};
