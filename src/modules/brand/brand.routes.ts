import { Router } from "express";
import { BrandController } from "./brand.controller";
import { BrandService } from "./brand.service";

const router = Router();

const brandController = new BrandController(new BrandService());

router.get("/", brandController.getBrands);

export default router;
