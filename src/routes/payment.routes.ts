import express from "express";
import {
  initializePayment,
  verifyPayment,
} from "../controllers/payment.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/init", protect, initializePayment);
router.get("/verify", verifyPayment);
router.post("/webhook", verifyPayment);

export default router;
