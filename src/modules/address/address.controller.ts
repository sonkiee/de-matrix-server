// address.controller.ts
import type { Response, NextFunction } from "express";
import type { Request } from "../../types/request"; // your custom req with req.user
import { AddressService } from "./address.service";
import type { CreateAddressInput } from "./address.dto";

export class AddressController {
  constructor(private addressService: AddressService) {}

  createAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }

      const body = req.body as CreateAddressInput;

      // Minimal validation (you can replace with Zod later)
      if (!body?.addressLine || !body?.city || !body?.state || !body?.zip) {
        res.status(400).json({ message: "Please enter all required fields" });
        return;
      }

      const created = await this.addressService.createForUser(userId, body);

      res.status(201).json({
        success: true,
        message: "Address added successfully",
        data: created,
      });
    } catch (err) {
      next(err);
    }
  };

  getMyAddresses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }

      const list = await this.addressService.listByUser(userId);

      res.status(200).json({
        success: true,
        message: "Addresses retrieved successfully",
        data: list,
      });
    } catch (err) {
      next(err);
    }
  };
}
