import express from "express";
import { initializePayment } from "../controllers/payment.controller";

const router = express.Router();

router.get("/init_payment", initializePayment);

export default router;
