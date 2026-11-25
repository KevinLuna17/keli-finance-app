import { z } from "zod";

export const profileFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "validation.nameTooShort")
    .max(100, "validation.nameTooLong"),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
