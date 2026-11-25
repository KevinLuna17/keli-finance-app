import { z } from "zod";

export const inviteMemberFormSchema = z.object({
  email: z.string().trim().email("validation.emailInvalid"),
});

export type InviteMemberFormValues = z.infer<typeof inviteMemberFormSchema>;
