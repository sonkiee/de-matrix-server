import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async (attempts = 5, delay = 3000) => {
  for (let i = 0; i < attempts; i++) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI!, {});
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(
        `❌ Database connection failed (Attempt ${i + 1}/${attempts})`
      );
      if (i < attempts - 1) {
        console.log(`🔄 Retrying in ${delay / 1000} seconds...`);
        await new Promise((res) => setTimeout(res, delay));
        delay *= 2; // Exponential backoff
      } else {
        console.error("🚨 Could not connect to MongoDB. Exiting...");
        process.exit(1);
      }
    }
  }
};

export default connectDB;
