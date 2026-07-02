import { AuthFieldError } from "@/components/auth/AuthFieldError";
import { WorkspaceFormFields } from "@/components/profile/workspace-form-fields";
import ScreenLayout from "@/components/ui/ScreenLayout";
import { useWorkspaceForm } from "@/hooks/use-workspace-form";
import { useBackendSync } from "@/hooks/useBackendSync";
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

export function CreateWorkspaceScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { refreshWorkspaces } = useBackendSync();

  const { form, onSubmit, submitError, isSubmitting, isSubmitDisabled } =
    useWorkspaceForm({
      mode: "create",
      onSuccess: async () => {
        await refreshWorkspaces();
        router.back();
      },
    });

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

        <WorkspaceFormFields
          control={form.control}
          errors={form.formState.errors}
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
              {t("workspaces.createWorkspace")}
            </Text>
          )}
        </Pressable>
      </View>
    </ScreenLayout>
  );
}
