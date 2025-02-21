import express from "express";

const router = express.Router();

// Home route ("/")
router.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to FTL E-commerce API</h1>
    <p>Use <bold>/api</bold> to interact with the API endpoints. For API documentation, visit <a href="/doc">/doc</a> .</p>
  `);
});

// API entry point ("/api")
router.get("/api", (req, res) => {
  res.json({
    message:
      "Welcome to the FTL E-commerce API. Use /api to interact with the API endpoints.",
  });
});

export default router;
