import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
      // unique: true,
    },
    type: {
      type: String,
      enum: ["smartphones", "parts", "tablets", "accessories"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    images: [{ type: String }],
    colors: [{ type: String }],
    sizes: [{ type: String }],
    tags: [{ type: String }],

    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
  },
  { discriminatorKey: "type", timestamps: true }
);

export const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
