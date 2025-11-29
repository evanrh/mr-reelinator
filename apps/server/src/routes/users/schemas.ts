import { z } from "zod";

export const UserCreationRequestSchema = z.object({
  username: z.string().max(32),
  email: z.string().email(),
  password: z.string(),
  inviteCode: z.string(),
});

export const UserCreationResponseSchema = z.object({
  id: z.number(),
});

export const getUsersResponseSchema = z.array(
  z.object({
    id: z.number(),
    username: z.string(),
    email: z.string().email(),
    inviteCode: z.string(),
  }),
);
