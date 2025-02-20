import express from "express";
import { yupload } from "../middleware/upload.middleware";
import { uploadBanner } from "../controllers/banner.controller";

const router = express.Router();

router.post("/", yupload, uploadBanner);
router.get("/");

export default router;
