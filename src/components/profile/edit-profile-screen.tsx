import { AuthFieldError } from "@/components/auth/AuthFieldError";
import { EditProfileFormFields } from "@/components/profile/edit-profile-form-fields";
import ScreenLayout from "@/components/ui/ScreenLayout";
import { useEditProfileForm } from "@/hooks/use-edit-profile-form";
import { useProfile } from "@/hooks/use-profile";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

export function EditProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { profile, isLoading, error, refresh } = useProfile();

  const { form, onSubmit, submitError, isSubmitting, isSubmitDisabled } =
    useEditProfileForm({
      profile,
      onSuccess: async () => {
        await refresh();
        router.back();
      },
    });

  if (isLoading) {
    return (
      <ScreenLayout
        edges={["bottom"]}
        background="modal"
        className="items-center justify-center"
      >
        <ActivityIndicator size="large" color="hsl(144, 16%, 37%)" />
      </ScreenLayout>
    );
  }

  if (error || !profile) {
    return (
      <ScreenLayout edges={["bottom"]} background="modal" className="px-6">
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-center text-base text-destructive">
            {error ?? t("profileScreen.profileNotAvailable")}
          </Text>
          <Pressable
            className="rounded-2xl bg-brand px-5 py-3"
            onPress={() => router.back()}
          >
            <Text className="font-semibold text-brand-foreground">{t("profileScreen.goBack")}</Text>
          </Pressable>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout edges={["bottom"]} background="modal" className="flex-1">
      <ScrollView
        className="flex-1 px-6"
        contentContainerClassName="pb-8 pt-4"
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {submitError ? (
          <View className="mb-4">
            <AuthFieldError message={submitError} />
          </View>
        ) : null}

        <EditProfileFormFields
          control={form.control}
          errors={form.formState.errors}
          profile={profile}
          disabled={isSubmitting}
        />
      </ScrollView>

      <View className="bg-card px-6 pb-6 pt-4">
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: isSubmitDisabled }}
          disabled={isSubmitDisabled}
          onPress={onSubmit}
          className={`items-center rounded-2xl py-4 ${
            isSubmitDisabled ? "bg-muted" : "bg-brand"
          }`}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text
              className={`text-base font-semibold ${
                isSubmitDisabled
                  ? "text-muted-foreground"
                  : "text-brand-foreground"
              }`}
            >
              {t("profileScreen.saveChanges")}
            </Text>
          )}
        </Pressable>
      </View>
    </ScreenLayout>
  );
}
