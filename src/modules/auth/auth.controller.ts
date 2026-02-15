import { NextFunction, Request, Response } from "express";
import { UserService } from "../user/user.service";
import { sign } from "../../utils/jwt";
import { set } from "../../utils/http-only-cookies";
import bcrypt from "bcryptjs";
import { db } from "../../db";
import { users } from "../../db/schema";

export class AuthController {
  constructor(private userService: UserService) {}

  signup = async (req: Request, res: Response, next: NextFunction) => {
    const { fullName, email, password } = req.body;

    const existing = await this.userService.findByEmail(email);

    if (existing)
      return res.status(409).json({ message: "User already exist" });

    const hashedPassword = bcrypt.hashSync(password, 10);

    const [user] = await db
      .insert(users)
      .values({
        fullName,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
      })
      .returning();

    const token = sign(user.id);
    set(res, token);
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
    set(res, token);
    res.json({ message: "Login successful" });
    return;

    // Continue with generating token or other login success logic
  };
}
