import cors from "cors";

export const corsOptions = {
  origin: "*",
  credentials: true,
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Authorization",
  ],
  methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
};
