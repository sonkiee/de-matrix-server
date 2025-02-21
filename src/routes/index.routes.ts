import express from "express";

const router = express.Router();

// Home route ("/")
router.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to FTL E-commerce API</h1>
    <p>Use <a href="/api/v1">/api/v1</a> to interact with the API endpoints.</p>
    <p>For API documentation, visit <a href="/doc">/doc</a> or <a href="/api">/api</a>.</p>
  `);
});

// API entry point ("/api")
router.get("/api", (req, res) => {
  res.json({
    message:
      "Welcome to the FTL E-commerce API. Use /api/v1 to interact with the API endpoints.",
  });
});

export default router;
