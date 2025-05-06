import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { Location } from "../models/location.model";
import User from "../models/user.model";

const newAddress = async (req: AuthRequest, res: Response) => {
  const { address, city, state, zip, country, label } = req.body;

  try {
    Object.keys(req.body).forEach((key) => {});

    if (!address || !city || !state || !zip || !country) {
      res.status(400).json({ message: "Please enter all fields" });
      return;
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    const location = await Location.create({
      address,
      city,
      state,
      zip,
      country,
      label,
      userId: user._id,
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
