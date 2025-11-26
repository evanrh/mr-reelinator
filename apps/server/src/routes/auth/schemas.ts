import { z } from "zod";

export const authLoginRequestSchema = z
  .object({
    username: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string(),
  })
  .refine((obj) => obj.email || obj.username, {
    message: "An email or username is required",
  });

export const authLoginResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
});

export const authRegistrationSchema = z.object({
  username: z.string().max(32),
  email: z.string().email(),
  password: z.string(),
  inviteCode: z.string(),
});

export const authRegistrationResponseSchema = z.object({
  message: z.string(),
});
