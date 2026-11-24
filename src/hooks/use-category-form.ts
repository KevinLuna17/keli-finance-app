import { ApiError } from "@/lib/api/client";
import {
  categoryFormSchema,
  CategoryFormValues,
} from "@/lib/validations/category-form.schema";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/services/categories/category.service";
import {
  CATEGORY_ERROR_CODES,
  type Category,
  type CategoryType,
} from "@/services/categories/category.types";
import { parseCategoryIconKey } from "@/types/category-icon";
import { useAuth } from "@clerk/expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export type CategoryFormMode = "create" | "edit";

type UseCategoryFormOptions = {
  mode: CategoryFormMode;
  workspaceId: string | undefined;
  category?: Category | null;
  initialType?: CategoryType;
  onSuccess?: () => void | Promise<void>;
  onDeleted?: () => void | Promise<void>;
};

/** Maps API error codes to translation keys. Never shows raw backend messages. */
function getCategoryErrorKey(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return "categories.errors.generic";
  }

  switch (error.code) {
    case CATEGORY_ERROR_CODES.nameTaken:
      return "categories.errors.nameTaken";
    case CATEGORY_ERROR_CODES.lastOfType:
      return "categories.errors.lastOfType";
    case CATEGORY_ERROR_CODES.reassignInvalid:
      return "categories.errors.reassignInvalid";
    default:
      return "categories.errors.generic";
  }
}

export function useCategoryForm({
  mode,
  workspaceId,
  category,
  initialType = "expense",
  onSuccess,
  onDeleted,
}: UseCategoryFormOptions) {
  const { getToken } = useAuth();
  const [submitErrorKey, setSubmitErrorKey] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [needsReassign, setNeedsReassign] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: "", type: initialType, iconKey: "folder" },
    mode: "onChange",
  });

  useEffect(() => {
    if (mode === "edit" && category) {
      form.reset({
        name: category.name,
        type: category.type,
        iconKey: parseCategoryIconKey(category.iconKey),
      });
    }
  }, [form, mode, category]);

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitErrorKey(null);

    try {
      if (mode === "create") {
        if (!workspaceId) {
          setSubmitErrorKey("categories.errors.generic");
          return;
        }

        await createCategory(() => getToken(), workspaceId, values);
      } else if (category) {
        await updateCategory(() => getToken(), category.id, {
          name: values.name,
          iconKey: values.iconKey,
        });
      }

      await onSuccess?.();
    } catch (error) {
      setSubmitErrorKey(getCategoryErrorKey(error));
    }
  });

  const removeCategory = async (reassignToCategoryId?: string) => {
    if (!category) {
      return;
    }

    setSubmitErrorKey(null);
    setIsDeleting(true);

    try {
      await deleteCategory(() => getToken(), category.id, reassignToCategoryId);
      await onDeleted?.();
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.code === CATEGORY_ERROR_CODES.inUse
      ) {
        setNeedsReassign(true);
        return;
      }

      setSubmitErrorKey(getCategoryErrorKey(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const { isSubmitting, isValid, isDirty } = form.formState;

  return {
    form,
    onSubmit,
    removeCategory,
    needsReassign,
    cancelReassign: () => setNeedsReassign(false),
    submitErrorKey,
    isSubmitting,
    isDeleting,
    isSubmitDisabled: isSubmitting || isDeleting || !isValid || !isDirty,
  };
}
