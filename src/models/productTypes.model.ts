import mongoose from "mongoose";
import { Product } from "./product.model";

//Smartphones
const SmartphoneSchema = new mongoose.Schema({
  brand: {
    type: mongoose.Schema.ObjectId,
    ref: "Brand",
    required: true,
  },
  model: { type: String },
  storageOptions: [{ type: String }],
  specs: { type: Object },
});
export const Smartphone =
  mongoose.models.Smartphone ||
  Product.discriminator("Smartphone", SmartphoneSchema);

// Accessories

const AccessorySchema = new mongoose.Schema({
  compatibleDevices: [{ type: String }],
  accessoryType: { type: String }, // e.g charger, case
});

export const Accessory =
  mongoose.models.Accessory ||
  Product.discriminator("accessories", AccessorySchema);

// Parts
const PartSchema = new mongoose.Schema({
  partNumber: { type: String },
  compatibleModels: [{ type: String }],
  condition: {
    type: String,
    enum: ["new", "used", "refurbished"],
  },
});
export const Part =
  mongoose.models.Part || Product.discriminator("parts", PartSchema);

// Tablets

const TabletSchema = new mongoose.Schema({
  brand: {
    type: mongoose.Schema.ObjectId,
    ref: "Brand",
    required: true,
  },
  os: String,
  screenSize: String,
  resolution: String,
});
export const Tablet =
  mongoose.models.Tablet || Product.discriminator("tablets", TabletSchema);
