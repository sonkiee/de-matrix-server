import express from "express";
import { protect } from "../middleware/auth.middleware";
import {
  newOrder,
  getOrderById,
  getOrders,
  getUserOrderById,
  getUserOrders,
} from "../controllers/order.controller";
import { validateObjectId } from "../utils/mongodb-validation";

const router = express.Router();

router.get("/admin", getOrders);
router.get("/admin/:id", getOrderById);
router.get("/user/", protect, getUserOrders);
router.get("/user/:id/", protect, getUserOrderById);

router.post("/new", protect, newOrder);

export default router;
