import express from "express";
import { ProductsController } from "./product.controller";
import { ProductsService } from "./product.service";

// import { protect } from "../middleware/auth.middleware";
// import { upload } from "../middleware/upload.middleware";
// import { validateObjectId } from "../utils/mongodb-validation";

const router = express.Router();

const productsController = new ProductsController(new ProductsService());

router.get("/", productsController.list);
router.get("/:id", productsController.getById);

export default router;
