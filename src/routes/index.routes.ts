import express from "express";

const router = express.Router();

// Home route ("/")
router.get("/", (req, res) => {
  res.json({
    message:
      "Welcome to FTL E-commerce API. For API documentation, visit /doc.",
  });
});

// API entry point ("/api")
router.get("/api", (req, res) => {
  res.json({
    message:
      "Welcome to the FTL E-commerce API. Use /api/v1 to interact with the API endpoints.",
  });
});

export default router;
