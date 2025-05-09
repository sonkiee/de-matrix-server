import express from "express";
import { getOrderById, getOrders } from "../controllers/order.controller";
import { newCategory } from "../controllers/category.controller";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/product.controller";
import { validateObjectId } from "../utils/mongodb-validation";
import { upload } from "../middleware/upload.middleware";
import { getUser, getProfile } from "../controllers/user.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/orders", getOrders);
router.get("/orders/:id", getOrderById);
router.post("/category/create", newCategory);
router.put("/products/:id", validateObjectId, updateProduct);
router.delete("/products/:id", validateObjectId, deleteProduct);
router.post("/products/create", upload.array("images", 5), createProduct);
router.get("/user/:id", validateObjectId, getUser);
router.get("/profile", protect, getProfile);

export default router;
