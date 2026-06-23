import { ApiError } from "@/lib/api/client";
import {
  workspaceFormSchema,
  WorkspaceFormValues,
} from "@/lib/validations/workspace-form.schema";
import {
  createWorkspace,
  deleteWorkspace,
  updateWorkspace,
} from "@/services/workspaces/workspace.service";
import type { CurrentWorkspace } from "@/services/workspaces/workspace.types";
import type { Workspace } from "@/services/workspaces/workspace.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@clerk/expo";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type UseWorkspaceFormMode = "create" | "edit";

type WorkspaceFormTarget = Pick<Workspace, "id" | "name">;

type UseWorkspaceFormOptions = {
  mode: UseWorkspaceFormMode;
  workspace?: WorkspaceFormTarget | CurrentWorkspace | null;
  onSuccess?: () => void | Promise<void>;
  onDeleted?: () => void | Promise<void>;
};

export function useWorkspaceForm({
  mode,
  workspace,
  onSuccess,
  onDeleted,
}: UseWorkspaceFormOptions) {
  const { getToken } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceFormSchema),
    defaultValues: { name: "" },
    mode: "onChange",
  });

  useEffect(() => {
    if (mode === "edit" && workspace) {
      form.reset({ name: workspace.name });
    }
  }, [form, mode, workspace]);

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      if (mode === "create") {
        await createWorkspace(() => getToken(), { name: values.name });
      } else if (workspace) {
        await updateWorkspace(() => getToken(), workspace.id, {
          name: values.name,
        });
      }

      await onSuccess?.();
    } catch (error) {
      setSubmitError(
        error instanceof ApiError
          ? error.message
          : mode === "create"
            ? "Could not create workspace"
            : "Could not update workspace",
      );
    }
  });

  const onDelete = async () => {
    if (!workspace) {
      return;
    }

    setSubmitError(null);
    setIsDeleting(true);

    try {
      await deleteWorkspace(() => getToken(), workspace.id);
      await onDeleted?.();
    } catch (error) {
      setSubmitError(
        error instanceof ApiError
          ? error.message
          : "Could not delete workspace",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const { isSubmitting, isValid, isDirty } = form.formState;
  const isSubmitDisabled =
    isSubmitting ||
    isDeleting ||
    !isValid ||
    (mode === "edit" && !isDirty);

  return {
    form,
    onSubmit,
    onDelete,
    submitError,
    isSubmitting,
    isDeleting,
    isSubmitDisabled,
  };
}
