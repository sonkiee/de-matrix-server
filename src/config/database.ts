import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async (attempts = 5) => {
  while (attempts) {
    try {
      await mongoose.connect(process.env.DB_URI!);
      console.log("✅ MongoDB connected");
      return;
    } catch (error) {
      console.error(`❌ Database connection failed. Retrying (${attempts})...`);
      attempts--;
      await new Promise((res) => setTimeout(res, 5000)); // Wait before retrying
    }
  }
  console.error("🚨 Could not connect to MongoDB. Exiting...");
  process.exit(1);
};

export default connectDB;
