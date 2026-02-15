// products.controller.ts
import { Request, Response } from "express";
import { ProductsService } from "./product.service";

export class ProductsController {
  constructor(private service: ProductsService) {}

  //   create = async (req: AuthRequest, res: Response) => {
  //     try {
  //       const files = req.files as Express.Multer.File[] | undefined;
  //       if (!files?.length)
  //         return res.status(400).json({ message: "Upload at least one image" });

  //       const imageUrls = await Promise.all(files.map((f) => uploadToR2(f)));

  //       const body = req.body as any;

  //       const input: CreateProductInput = {
  //         title: String(body.title ?? ""),
  //         description: body.description ?? null,
  //         categoryId: String(body.categoryId ?? ""),
  //         brandId: body.brandId ? String(body.brandId) : null,
  //         price: Number(body.price),
  //         stock: Number(body.stock),
  //         colors: body.colors,
  //         sizes: body.sizes,
  //         isFeatured: body.isFeatured === "true" || body.isFeatured === true,
  //         isBestSeller:
  //           body.isBestSeller === "true" || body.isBestSeller === true,
  //         isNewArrival:
  //           body.isNewArrival === "true" || body.isNewArrival === true,
  //       };

  //       const product = await this.service.create(input, imageUrls);
  //       return res.status(201).json({ product });
  //     } catch (e: any) {
  //       const code = e?.statusCode ?? 500;
  //       return res.status(code).json({ message: e?.message ?? "Server error" });
  //     }
  //   };

  list = async (req: Request, res: Response) => {
    const filter = String(req.query.filter ?? "");
    const rows = await this.service.list(filter);
    if (!rows.length)
      return res.status(404).json({ message: "No products found" });

    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: rows,
    });
  };

  getById = async (req: Request, res: Response) => {
    try {
      const product = await this.service.getById(String(req.params.id));
      return res.status(200).json({
        success: true,
        message: "Product retrieved successfully",
        data: product,
      });
    } catch (e: any) {
      const code = e?.statusCode ?? 500;
      return res.status(code).json({ message: e?.message ?? "Server error" });
    }
  };

  //   update = async (req: AuthRequest, res: Response) => {
  //     try {
  //       const id = String(req.params.id);
  //       const body = req.body as any;

  //       const updated = await this.service.update(id, {
  //         title: body.title,
  //         description: body.description,
  //         categoryId: body.categoryId,
  //         brandId: body.brandId,
  //         price: body.price !== undefined ? Number(body.price) : undefined,
  //         stock: body.stock !== undefined ? Number(body.stock) : undefined,
  //         isFeatured:
  //           body.isFeatured !== undefined
  //             ? body.isFeatured === "true" || body.isFeatured === true
  //             : undefined,
  //         isBestSeller:
  //           body.isBestSeller !== undefined
  //             ? body.isBestSeller === "true" || body.isBestSeller === true
  //             : undefined,
  //         isNewArrival:
  //           body.isNewArrival !== undefined
  //             ? body.isNewArrival === "true" || body.isNewArrival === true
  //             : undefined,
  //       });

  //       return res.status(200).json({
  //         success: true,
  //         message: "Product updated successfully",
  //         data: updated,
  //       });
  //     } catch (e: any) {
  //       const code = e?.statusCode ?? 500;
  //       return res.status(code).json({ message: e?.message ?? "Server error" });
  //     }
  //   };

  //   delete = async (req: AuthRequest, res: Response) => {
  //     try {
  //       await this.service.delete(String(req.params.id));
  //       return res
  //         .status(200)
  //         .json({ success: true, message: "Product deleted successfully" });
  //     } catch (e: any) {
  //       const code = e?.statusCode ?? 500;
  //       return res.status(code).json({ message: e?.message ?? "Server error" });
  //     }
  //   };
}
