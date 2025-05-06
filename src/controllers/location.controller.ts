import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { Location } from "../models/location.model";
import User from "../models/user.model";

const newAddress = async (req: AuthRequest, res: Response) => {
  const { label } = req.body;

  const requiredFields = ["address", "city", "state", "zip", "country"];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const location = await Location.create({
      ...req.body,
      customer: user._id,
    });

    res.status(201).json({
      success: true,
      message: "Location added successfully",
      data: location,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getAddress = async (req: AuthRequest, res: Response) => {
  try {
    const locations = await Location.find({ customer: req.user._id });

    if (locations.length === 0) {
      res.status(401).json({ message: "No location fround for user" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Locations retrieved successfully",
      data: locations,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    console.log(error);
  }
};

export { newAddress, getAddress };
