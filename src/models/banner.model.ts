import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["small", "big"],
      required: true,
      unique: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    title: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Banner || mongoose.model("Banner", BannerSchema);
