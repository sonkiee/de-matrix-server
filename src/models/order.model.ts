import mongoose from "mongoose";
import User from "./user.model";

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
