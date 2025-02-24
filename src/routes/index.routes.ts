import express, { Request, Response } from "express";

const router = express.Router();

// Home route ("/")
router.get("/", (req: Request, res: Response) => {
  res.send(`
    <h1>Welcome to FTL E-commerce API</h1>
    <p>Use <strong>/api</strong> to interact with the API endpoints. For API documentation, visit <a href="/doc">/doc</a> .</p>
    <p><em>For more information, visit the documentation at /doc </em></p>
  `);
});

// API entry point ("/api")
router.get("/api", (req: Request, res: Response) => {
  res.redirect("/doc"); // Auto-redirect to Swagger documentation
});

export default router;
