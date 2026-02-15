import { Router } from "express";
import { AuthController } from "./auth.controller";
import { UserService } from "../user/user.service";
import { validate } from "../../middleware/validate.middleware";
import { signinSchema, signupSchema } from "../../validation/auth.validation";
import { asyncHandler } from "../../utils/async-handler";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

const authController = new AuthController(new UserService());

router.post("/signin", validate(signinSchema), authController.signin);
router.post("/signup", validate(signupSchema), authController.signup);

export default router;
