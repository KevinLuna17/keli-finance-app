import { z } from "zod";
import { SUPPORTED_CURRENCIES } from "@/lib/currencies";

export const workspaceFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  currency: z.enum(SUPPORTED_CURRENCIES),
});

export type WorkspaceFormValues = z.infer<typeof workspaceFormSchema>;
