import { z } from "zod";

export const validateRequest = (schema: z.ZodSchema, data: any) => {
  const validationResult = schema.safeParse(data);
  if (!validationResult.success) {
    throw new Error(
      validationResult.error.errors.map((err) => err.message).join(", ")
    );
  }
  return validationResult.data;
};
