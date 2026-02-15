import express from "express";
// import { updateProfile, getProfile } from "../controllers/user.controller";
// import { protect, admin } from "../middleware/auth.middleware";
// import { authLimiter } from "../config/limiter";
// import { newAddress, getAddress } from "../controllers/location.controller";

import { protect } from "../../middleware/auth.middleware";
import { AuthController } from "../auth/auth.controller";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";

const router = express.Router();

const userController = new UserController(new UserService());

router.get("/profile", protect, userController.getProfile);
// router.put("/profile", protect, updateProfile);
// router.post("/profile/address", protect, newAddress);
// router.get("/profile/address", protect, getAddress);

export default router;
