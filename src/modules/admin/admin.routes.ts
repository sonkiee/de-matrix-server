import express from "express";
import { OrderController } from "../order/order.controller";
import { OrderService } from "../order/order.service";
import { PaymentsController } from "../payment/payment.controller";
import { UserController } from "../user/user.controller";
import { UserService } from "../user/user.service";
import { ProductsController } from "../product/product.controller";
import { ProductsService } from "../product/product.service";
import { upload } from "../../middleware/upload.middleware";
import { BrandController } from "../brand/brand.controller";
import { BrandService } from "../brand/brand.service";
import { CategoryController } from "../category/category.controller";
import { CategoryService } from "../category/category.service";
// import { getOrderById, getOrders } from "../controllers/order.controller";
// import { newCategory } from "../controllers/category.controller";
// import {
//   createProduct,
//   deleteProduct,
//   updateProduct,
// } from "../controllers/product.controller";
// import { validateObjectId } from "../utils/mongodb-validation";
// import { upload } from "../middleware/upload.middleware";
// import { getUser, getProfile } from "../controllers/user.controller";
// import { protect } from "../middleware/auth.middleware";

const router = express.Router();
const orderController = new OrderController(new OrderService());
const paymentController = new PaymentsController();
const userController = new UserController(new UserService());
const productsController = new ProductsController(new ProductsService());

const brandController = new BrandController(new BrandService());
const categoryController = new CategoryController(new CategoryService());

router.get("/orders", orderController.listOrders);
router.get("/payments", paymentController.list);
router.get("/users", userController.list);

router.get("/products", productsController.list);

router.post("/products", upload.array("files", 5), productsController.create);

router.get("/brands", brandController.list);
router.get("/categories", categoryController.list);

// router.get("/orders/:id", getOrderById);
// router.post("/category/create", newCategory);
// router.put("/products/:id", validateObjectId, updateProduct);

// router.post("/products/create", upload.array("images", 5), createProduct);
// router.get("/user/:id", validateObjectId, getUser);
// router.get("/profile", protect, getProfile);

export default router;
