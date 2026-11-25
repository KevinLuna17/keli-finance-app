import { z } from "zod";
import { SUPPORTED_CURRENCIES } from "@/lib/currencies";

export const workspaceFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "validation.nameTooShort")
    .max(100, "validation.nameTooLong"),
  currency: z.enum(SUPPORTED_CURRENCIES, "validation.currencyRequired"),
});

export type WorkspaceFormValues = z.infer<typeof workspaceFormSchema>;
