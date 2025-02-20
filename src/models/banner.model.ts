import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema({});

export default mongoose.models.Banner || mongoose.model("Banner", BannerSchema);
