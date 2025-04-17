import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    logo: { type: String },
    isVisible: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Brand =
  mongoose.models.Brand || mongoose.model("Brand", BrandSchema);
