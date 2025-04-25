import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

export const corsOptions = {
  origin: "http://localhost:3000", // or your frontend domain
  credentials: true, // ✅ allow cookies
  methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
};

// export const corsOptions = {
//   origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
//   allowedHeaders: ["Content-Type", "Authorization"],
//   methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
//   credentials: true,
// };
