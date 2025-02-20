import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";

import { protect } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import { validateObjectId } from "../utils/mongodb-validation";

const router = express.Router();

router.get("/", getProducts);
router.post("/", upload.array("images", 5), createProduct);
router.get("/:id", validateObjectId, getProductById);
router.put("/:id", validateObjectId, updateProduct);

router.delete("/:id", validateObjectId, deleteProduct);

export default router;
