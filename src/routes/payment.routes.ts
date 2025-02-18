import express from "express";
import { initializePayment } from "../controllers/payment.controller";

const router = express.Router();

router.post("/initialize-payment", initializePayment);

export default router;
