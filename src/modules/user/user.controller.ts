import { Request, Response } from "express";
import { UserService } from "./user.service";

export class UserController {
  constructor(private userService: UserService) {}

  getProfile = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    console.log("User ID from token:", userId);

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await this.userService.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
    });
  };

  updateProfile = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    console.log("User ID from token:", userId);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await this.userService.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { firstName, lastName, phone } = req.body;

    const updatedUser = await this.userService.updateProfile(userId, {
      firstName,
      lastName,
      phone,
    });

    res.status(200).json({
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      createdAt: updatedUser.createdAt,
    });
  };
}
