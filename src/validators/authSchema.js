import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  // role: z.enum(["admin", "college", "student", "user"]),
});

export const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  mobNo: z.coerce.number({
    invalid_type_error: "Mobile number must be a valid number",
    required_error: "Mobile number is required",
  }),

  password: z.string().min(6),
  userName: z.string().optional(),
  role: z.enum(["admin", "college", "student", "user"]),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});
