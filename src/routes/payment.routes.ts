import express from "express";
import {
  initializePayment,
  verifyPayment,
} from "../controllers/payment.controller";

const router = express.Router();

router.post("/init", initializePayment);
router.get("/verify", verifyPayment);

export default router;
