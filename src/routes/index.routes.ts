import express, { Request, Response } from "express";
import user from "./user.routes";
import product from "./product.routes";
import category from "./category.routes";
import payment from "./payment.routes";
import order from "./order.routes";
import admin from "./admin.routes";
import banner from "./banner.routes";
import address from "./location.routes";

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

router.use("/api/users", user);
router.use("/api/products", product);
router.use("/api/payment", payment);
router.use("/api/orders", order);
router.use("/api/categories", category);
router.use("/api/banners", banner);
router.use("/api/admin", admin);
router.use("/api/user/address", address);

router.use("/uploads", express.static("public/uploads"));

export default router;
