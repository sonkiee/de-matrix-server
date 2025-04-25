import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { Location } from "../models/location.model";

const addLocation = async (req: AuthRequest, res: Response) => {
  const { address, city, state, zipCode, country, label } = req.body;
  const { user } = req;

  try {
    if (!address || !city || !state || !zipCode || !country || !label) {
      res.status(400).json({ message: "Please enter all fields" });
      return;
    }

    const location = await Location.create({
      address,
      city,
      state,
      zipCode,
      country,
      label,
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

const getLocations = async (req: AuthRequest, res: Response) => {
  try {
    const locations = await Location.find({ customer: req.user._id });

    if (locations.length === 0) {
      res.status(404).json({ message: "No locations found" });
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

export { addLocation, getLocations };
