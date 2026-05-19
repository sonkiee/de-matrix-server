import { Request, Response } from "express";
import { UserService } from "../user/user.service";

export class AdminController {
  constructor(private userService: UserService) {}

  dashboard = async (
    req: Request,
    res: Response,
  ): Promise<Response<{ message: string }>> => {
    return res.json({ message: "Admin dashboard" });
  };

  // TODO: Implement admin invitation flow
  // Instead of updating, send invitaion email
  promote = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const admin = await this.userService.promote(email);
    return res.json(admin);
  };
}
