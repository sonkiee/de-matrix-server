import { NextFunction, Request, Response } from "express";
import { BrandService } from "./brand.service";

export class BrandController {
  constructor(private brandService: BrandService) {}

  // getBrand = async (req: Request, res: Response, next: NextFunction) => {
  //   const { slug } = req.params;

  //   if (!slug) {
  //     res.status(400).json({ message: "Slug is required" });
  //     return;
  //   }

  //   const brand = await this.brandService.findBySlug(slug);

  //   if (!brand) {
  //     res.status(404).json({ message: "Brand not found" });
  //     return;
  //   }

  //   res.status(200).json(brand);
  // };

  list = async (req: Request, res: Response) => {
    const brands = await this.brandService.list();
    res.status(200).json(brands);
  };

  createBrand = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, "-").trim();

    const existing = await this.brandService.findBySlug(slug);

    if (existing) {
      res.status(409).json({ message: "Brand already exist" });
      return;
    }

    const brand = await this.brandService.create(name, slug);

    res.status(201).json(brand);
  };
}
