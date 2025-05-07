import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;
console.log("Allowed origins:", ALLOWED_ORIGINS);
if (!ALLOWED_ORIGINS) {
  throw new Error("Missing ALLOWED_ORIGINS environment variable."); // Handle this error in your production code.
}
export const corsOptions = {
  origin: ALLOWED_ORIGINS, // or your frontend domain
  credentials: true, // ✅ allow cookies
  methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Origin",
  ],
};

// export const corsOptions = {
//   origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
//   allowedHeaders: ["Content-Type", "Authorization"],
//   methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
//   credentials: true,
// };
