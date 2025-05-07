import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;
if (!ALLOWED_ORIGINS) {
  throw new Error("Missing ALLOWED_ORIGINS environment variable."); // Handle this error in your production code.
  process.exit(1); // Ensure the process exits with an error code.
}
export const corsOptions = {
  origin: ALLOWED_ORIGINS, // or your frontend domain
  credentials: true, // ✅ allow cookies
  methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
};

// export const corsOptions = {
//   origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
//   allowedHeaders: ["Content-Type", "Authorization"],
//   methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
//   credentials: true,
// };
