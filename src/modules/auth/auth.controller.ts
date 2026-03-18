import { NextFunction, Request, Response } from "express";
import { UserService } from "../user/user.service";
import { sign } from "../../utils/jwt";
import { cookie } from "../../utils/http-only-cookies";
import bcrypt from "bcryptjs";
import { db } from "../../db";
import { users } from "../../db/schema";

export class AuthController {
  constructor(private userService: UserService) {}

  signup = async (req: Request, res: Response) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await this.userService.findByEmail(email);

    if (existing)
      return res.status(409).json({ message: "User with email already exist" });

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await this.userService.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = sign(user.id);
    cookie.set(res, token);
    return res.status(201).json({ message: "Registration successful" });
  };

  signin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await this.userService.findByEmail(email.toLowerCase().trim());

    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }
    const token = sign(user.id);
    cookie.set(res, token);
    res.json({ message: "Login successful" });
    return;

    // Continue with generating token or other login success logic
  };

  me = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId as string;
    const user = await this.userService.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      userId: user.id,
      role: user.role,
    });
  };

  logout = async (req: Request, res: Response) => {
    cookie.clear(res);
    res.status(200).json({ message: "Logout successful" });
  };
}
