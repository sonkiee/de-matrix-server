import express from "express";
import { yupload } from "../middleware/upload.middleware";
import { getBanner, uploadBanner } from "../controllers/banner.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Banners
 *   description: Banner management endpoints for website banners
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Banner:
 *       type: object
 *       required:
 *         - type
 *         - imageUrl
 *       properties:
 *         type:
 *           type: string
 *           enum: [small, big]
 *           description: Size type of the banner
 *           example: "big"
 *         imageUrl:
 *           type: string
 *           description: URL of the banner image
 *           example: "https://storage.example.com/banners/homepage-banner.jpg"
 *         title:
 *           type: string
 *           description: Banner title (optional)
 *           example: "Summer Sale"
 *         description:
 *           type: string
 *           description: Banner description (optional)
 *           example: "Get up to 50% off on all products"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of banner creation
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of last banner update
 */

/**
 * @swagger
 * /api/banners:
 *   get:
 *     summary: Get all banners
 *     tags: [Banners]
 *     responses:
 *       200:
 *         description: List of all banners retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 banners:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Banner'
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Upload a new banner
 *     tags: [Banners]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - image
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [small, big]
 *                 description: Size type of the banner
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Banner image file
 *               title:
 *                 type: string
 *                 description: Banner title (optional)
 *               description:
 *                 type: string
 *                 description: Banner description (optional)
 *     responses:
 *       201:
 *         description: Banner uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Banner'
 *       400:
 *         description: Invalid input - Missing required fields or invalid banner type
 *       409:
 *         description: Conflict - Banner type already exists
 *       500:
 *         description: Server error
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

router.post("/", yupload, uploadBanner);
router.get("/", getBanner);

export default router;
