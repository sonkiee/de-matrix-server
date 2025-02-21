"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const order_controller_1 = require("../controllers/order.controller");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management endpoints for both users and administrators
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     OrderProduct:
 *       type: object
 *       required:
 *         - product
 *         - quantity
 *         - price
 *       properties:
 *         product:
 *           type: string
 *           format: mongoose.ObjectId
 *           description: Reference to the product
 *         quantity:
 *           type: number
 *           minimum: 1
 *           default: 1
 *           description: Quantity of the product
 *         price:
 *           type: number
 *           description: Price per unit at time of order
 *
 *     Order:
 *       type: object
 *       required:
 *         - user
 *         - products
 *         - totalAmount
 *         - reference
 *         - shippingAddress
 *       properties:
 *         user:
 *           type: string
 *           format: mongoose.ObjectId
 *           description: Reference to the user who placed the order
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderProduct'
 *           description: Array of products in the order
 *         totalAmount:
 *           type: number
 *           description: Total order amount
 *           default: 0
 *         reference:
 *           type: string
 *           description: Unique order reference number
 *         shippingAddress:
 *           type: string
 *           description: Delivery address for the order
 *         status:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *           default: pending
 *           description: Current order status
 *         paymentStatus:
 *           type: string
 *           enum: [pending, paid, failed]
 *           default: pending
 *           description: Payment status of the order
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
/**
 * @swagger
 * /api/orders/admin:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized - Invalid or missing authentication
 *       403:
 *         description: Forbidden - User is not an admin
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/orders/admin/{id}:
 *   get:
 *     summary: Get specific order by ID (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User is not an admin
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/orders/user:
 *   get:
 *     summary: Get all orders for the authenticated user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/orders/user/{id}:
 *   get:
 *     summary: Get specific order by ID for authenticated user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Order belongs to another user
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/orders/user/new:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - products
 *               - shippingAddress
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - product
 *                     - quantity
 *                   properties:
 *                     product:
 *                       type: string
 *                       description: Product ID
 *                     quantity:
 *                       type: number
 *                       minimum: 1
 *               shippingAddress:
 *                 type: string
 *                 description: Delivery address
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/admin", order_controller_1.getOrders);
router.get("/admin/:id", order_controller_1.getOrderById);
router.get("/user/", auth_middleware_1.protect, order_controller_1.getUserOrders);
router.get("/user/:id/", auth_middleware_1.protect, order_controller_1.getUserOrderById);
router.post("/user/new", auth_middleware_1.protect, order_controller_1.newOrder);
exports.default = router;
