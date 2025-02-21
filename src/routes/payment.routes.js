"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("../controllers/payment.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment processing and verification endpoints
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - user
 *         - order
 *         - reference
 *         - amount
 *       properties:
 *         user:
 *           type: string
 *           format: mongoose.ObjectId
 *           description: Reference to the user making the payment
 *         order:
 *           type: string
 *           format: mongoose.ObjectId
 *           description: Reference to the order being paid for
 *         reference:
 *           type: string
 *           description: Unique payment reference/transaction ID
 *         status:
 *           type: string
 *           enum: [pending, paid, failed]
 *           default: pending
 *           description: Current status of the payment
 *         amount:
 *           type: number
 *           description: Payment amount in smallest currency unit (e.g., cents)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of payment creation
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of last payment update
 */
/**
 * @swagger
 * /api/payments/init:
 *   post:
 *     summary: Initialize a new payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - amount
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: ID of the order to be paid for
 *               amount:
 *                 type: number
 *                 description: Payment amount in smallest currency unit
 *               currency:
 *                 type: string
 *                 default: USD
 *                 description: Payment currency code
 *     responses:
 *       200:
 *         description: Payment initialization successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reference:
 *                   type: string
 *                   description: Payment reference for tracking
 *                 authorization_url:
 *                   type: string
 *                   description: URL to complete payment
 *                 status:
 *                   type: string
 *                   enum: [pending]
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized - Invalid or missing authentication
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/payments/verify:
 *   get:
 *     summary: Verify payment status
 *     tags: [Payments]
 *     parameters:
 *       - in: query
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment reference to verify
 *     responses:
 *       200:
 *         description: Payment verification successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [pending, paid, failed]
 *                 reference:
 *                   type: string
 *                 amount:
 *                   type: number
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid reference
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     summary: Payment gateway webhook endpoint
 *     tags: [Payments]
 *     description: |
 *       Endpoint for receiving payment gateway webhooks.
 *       Verifies webhook signature and updates payment status.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *                 description: Webhook event type
 *               data:
 *                 type: object
 *                 description: Event data including payment details
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       401:
 *         description: Invalid webhook signature
 *       400:
 *         description: Invalid webhook payload
 *       500:
 *         description: Server error
 *     security: []  # Webhook endpoints typically use HMAC validation instead of bearer tokens
 */
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.post("/init", auth_middleware_1.protect, payment_controller_1.initializePayment);
router.get("/verify", payment_controller_1.verifyPayment);
router.post("/webhook", payment_controller_1.paymentWebhook);
exports.default = router;
