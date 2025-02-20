import express from "express";
import { protect } from "../middleware/auth.middleware";
import { newOrder } from "../controllers/order.controller";

const router = express.Router();

router.post("/new", protect, newOrder);

export default router;
