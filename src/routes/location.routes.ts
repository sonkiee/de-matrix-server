import { Router } from "express";
import { getAddress, newAddress } from "../controllers/location.controller";

const router = Router();

router.post("/", newAddress);
router.get("/", getAddress);

export default router;
