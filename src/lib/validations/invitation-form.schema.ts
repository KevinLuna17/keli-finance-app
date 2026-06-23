import { z } from "zod";

export const inviteMemberFormSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
});

export type InviteMemberFormValues = z.infer<typeof inviteMemberFormSchema>;
