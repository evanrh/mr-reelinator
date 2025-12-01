import z from "zod";

export const paginationPropsSchema = z.object({
  limit: z.coerce.number().default(25),
  offset: z.coerce.number().default(0),
});
