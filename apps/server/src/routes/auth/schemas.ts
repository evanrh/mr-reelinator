import { z } from "zod";

export const authLoginRequestSchema = z.object({
  username: z.string().optional(),
  email: z.string().optional(),
  password: z.string()
})
.refine(
  (obj) => obj.email || obj.username,
  { message: 'An email or username is required' }
)

export const authLoginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})
