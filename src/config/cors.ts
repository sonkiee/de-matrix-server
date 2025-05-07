import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",").map((origin) =>
  origin.trim()
);
export const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (!origin || ALLOWED_ORIGINS?.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }, // or your frontend domain
  methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Origin",
    "Origin",
    "X-Requested-With",
  ],
};

console.log("CORS options:", corsOptions);

// export const corsOptions = {
//   origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
//   allowedHeaders: ["Content-Type", "Authorization"],
//   methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
//   credentials: true,
// };
