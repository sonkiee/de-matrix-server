import express from "express";
import { initializePayment } from "../controllers/payment.controller";

const router = express.Router();

router.post("/init_payment", initializePayment);

export default router;
