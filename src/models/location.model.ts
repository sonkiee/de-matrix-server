import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema(
  {
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String },
    label: { type: String, enum: ["primary", "secondary"] },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  },
  {
    timestamps: true,
  }
);

export const Location =
  mongoose.models.Location || mongoose.model("Location", LocationSchema);
