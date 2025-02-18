import express from "express";
import {
  register,
  login,
  updateProfile,
  getProfile,
} from "../controllers/user.controller";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "User route" });
});
router.post("/register", register);
router.post("/login", login);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

export default router;
