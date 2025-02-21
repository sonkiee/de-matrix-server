import express from "express";
import {
  register,
  login,
  updateProfile,
  getProfile,
} from "../controllers/user.controller";
import { protect, admin } from "../middleware/auth.middleware";
import { authLimiter } from "../config/limiter";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "User route" });
});
router.post("/register", register);
router.post("/login", authLimiter, login);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.get("/admin", admin, (req, res) => {
  res.json({ message: "Admin route" });
});

export default router;
