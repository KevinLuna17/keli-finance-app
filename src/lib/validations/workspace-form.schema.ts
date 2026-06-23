import { z } from "zod";

export const workspaceFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
});

export type WorkspaceFormValues = z.infer<typeof workspaceFormSchema>;
