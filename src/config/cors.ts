import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;

export const corsOptions = {
  origin: ALLOWED_ORIGINS || "*",
  credentials: true, // ✅ allow cookies
  methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    ALLOWED_ORIGINS ? "Access-Control-Allow-Origin" : "",
  ],
};

// export const corsOptions = {
//   origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
//   allowedHeaders: ["Content-Type", "Authorization"],
//   methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
//   credentials: true,
// };
