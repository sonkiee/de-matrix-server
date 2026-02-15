import * as z from "zod";

export const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.email("Invalid email address").max(180),
  password: z.string().min(6, "Password must be atleast 6 characters"),
});

export const signinSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string({ error: "password is required" })
    .min(6, "Password must be atleast 6 characters"),
});
