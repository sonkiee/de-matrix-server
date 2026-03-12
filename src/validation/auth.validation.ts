import * as z from "zod";

export const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.email("Invalid email address").max(180),
  password: z.string().min(6, "Password must be atleast 6 characters"),
});

export const signinSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string({ error: "password is required" })
    .min(6, "Password must be atleast 6 characters"),
});
