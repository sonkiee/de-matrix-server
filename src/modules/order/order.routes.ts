import express from "express";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { protect } from "../../middleware/auth.middleware";

// import { validateObjectId } from "../utils/mongodb-validation";

const router = express.Router();
const orderController = new OrderController(new OrderService());

// router.get("/", protect, getUserOrders);
// router.get("/:id/", protect, getUserOrderById);
router.post("/", protect, orderController.newOrder);

export default router;
