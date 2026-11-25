import { CATEGORY_ICON_KEYS } from "@/types/category-icon";
import { z } from "zod";

/** Messages are translation keys, resolved with `t()` when rendered. */
export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "categories.validation.nameRequired")
    .max(50, "categories.validation.nameTooLong"),
  type: z.enum(["income", "expense"]),
  iconKey: z.enum(CATEGORY_ICON_KEYS),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
