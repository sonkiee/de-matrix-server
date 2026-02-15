import express, { Request, Response, Router } from "express";
import user from "../modules/user/user.routes";
import product from "../modules/product/product.routes";
import category from "../modules/category/category.routes";
// import payment from "./payment.routes";
import order from "../modules/order/order.routes";
// import admin from "./admin.routes";
import auth from "../modules/auth/auth.routes";
import brand from "../modules/brand/brand.routes";
import { admin } from "../middleware/auth.middleware";
// import banner from "./banner.routes";
// import address from "./location.routes";

const router = Router();

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

router.use("/auth", auth); // Authentication middleware
router.use("/user", user);
router.use("/brands", brand);
router.use("/products", product);
// router.use("/order/payment", payment);
router.use("/orders", order);
router.use("/categories", category);
// router.use("/banners", banner);
// router.use("/admin", admin);
// router.use("/user/address", address);

// router.use("/uploads", express.static("public/uploads"));
router.get("/favicon.ico", (_req, res) => res.status(204).end());

export default router;
