import { getApiErrorMessage } from "@/lib/api/api-error-message";
import {
  profileFormSchema,
  ProfileFormValues,
} from "@/lib/validations/profile-form.schema";
import { updateProfile } from "@/services/profile/profile.service";
import type { Profile } from "@/services/profile/profile.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@clerk/expo";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type UseEditProfileFormOptions = {
  profile: Profile | null;
  onSuccess?: (profile: Profile) => void;
};

export function useEditProfileForm({
  profile,
  onSuccess,
}: UseEditProfileFormOptions) {
  const { getToken } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { name: "" },
    mode: "onChange",
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name ?? "",
      });
    }
  }, [form, profile]);

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      const updatedProfile = await updateProfile(() => getToken(), {
        name: values.name,
      });

      onSuccess?.(updatedProfile);
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(error, "errors.updateProfile"),
      );
    }
  });

  const { isSubmitting, isValid, isDirty } = form.formState;

  return {
    form,
    onSubmit,
    submitError,
    isSubmitting,
    isSubmitDisabled: isSubmitting || !isValid || !isDirty,
  };
}
