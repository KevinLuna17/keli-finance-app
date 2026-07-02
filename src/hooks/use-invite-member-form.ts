import { ApiError } from "@/lib/api/client";
import {
  inviteMemberFormSchema,
  InviteMemberFormValues,
} from "@/lib/validations/invitation-form.schema";
import { createWorkspaceInvitation } from "@/services/invitations/invitation.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@clerk/expo";
import { useState } from "react";
import { useForm } from "react-hook-form";

type UseInviteMemberFormOptions = {
  workspaceId: string;
  onSuccess?: () => void | Promise<void>;
};

export function useInviteMemberForm({
  workspaceId,
  onSuccess,
}: UseInviteMemberFormOptions) {
  const { getToken } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<InviteMemberFormValues>({
    resolver: zodResolver(inviteMemberFormSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      await createWorkspaceInvitation(() => getToken(), workspaceId, {
        email: values.email,
      });

      await onSuccess?.();
    } catch (error) {
      setSubmitError(
        error instanceof ApiError
          ? error.message
          : "Could not send invitation",
      );
    }
  });

  const { isSubmitting, isValid } = form.formState;

  return {
    form,
    onSubmit,
    submitError,
    isSubmitting,
    isSubmitDisabled: isSubmitting || !isValid,
  };
}
