import express from "express";
import { PaymentsController } from "./payment.controller";
import { protect } from "../../middleware/auth.middleware";

const router = express.Router();

const paymentController = new PaymentsController();

router.post("/init", protect, paymentController.initialize);
router.get("/verify", paymentController.verify);
// router.post(
//   "/webhook",
//   express.raw({
//     type: "application/json",
//   }),
//   paymentController.webhook,
// );

export default router;
