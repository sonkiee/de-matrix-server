import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

export const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
};
