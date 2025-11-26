import z from "zod";

export const errorResponseSchema = z.object({
  message: z.string(),
});

export const genericSuccessResponseSchema = z.object({
  message: z.literal("success"),
});
