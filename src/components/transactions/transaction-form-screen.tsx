import { AuthFieldError } from "@/components/auth/AuthFieldError";
import { TransactionFormFields } from "@/components/transactions/transaction-form-fields";
import ScreenLayout from "@/components/ui/ScreenLayout";
import { useCategories } from "@/hooks/use-categories";
import {
  TransactionFormMode,
  useTransactionForm,
} from "@/hooks/use-transaction-form";
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

type TransactionFormScreenProps = {
  mode: TransactionFormMode;
  transactionId?: string;
};

export function TransactionFormScreen({
  mode,
  transactionId,
}: TransactionFormScreenProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { currentWorkspace, status: syncStatus } = useBackendSync();
  const workspaceId = currentWorkspace?.id;
  const submitLabel =
    mode === "create" ? t("transactionForm.saveTransaction") : t("transactionForm.updateTransaction");

  const {
    categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useCategories({ workspaceId });

  const {
    form,
    onSubmit,
    submitError,
    loadError,
    isLoadingInitial,
    isSubmitting,
    isSubmitDisabled,
  } = useTransactionForm({
    mode,
    transactionId,
    workspaceId: workspaceId ?? "",
    onSuccess: () => router.back(),
  });

  if (!workspaceId) {
    if (syncStatus === "synced") {
      return (
        <ScreenLayout edges={["bottom"]} background="modal" className="px-6">
          <View className="flex-1 items-center justify-center gap-4">
            <Text className="text-center text-base text-destructive">
              {t("transactionForm.workspaceUnavailable")}
            </Text>
            <Pressable
              className="rounded-2xl bg-brand px-5 py-3"
              onPress={() => router.back()}
            >
              <Text className="font-semibold text-brand-foreground">{t("transactionForm.goBack")}</Text>
            </Pressable>
          </View>
        </ScreenLayout>
      );
    }

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

  if (isLoadingCategories || isLoadingInitial) {
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

  if (loadError || categoriesError) {
    return (
      <ScreenLayout edges={["bottom"]} background="modal" className="px-6">
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-center text-base text-destructive">
            {loadError ?? categoriesError}
          </Text>
          <Pressable
            className="rounded-2xl bg-brand px-5 py-3"
            onPress={() => router.back()}
          >
            <Text className="font-semibold text-brand-foreground">{t("transactionForm.goBack")}</Text>
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

        <TransactionFormFields
          control={form.control}
          setValue={form.setValue}
          errors={form.formState.errors}
          categories={categories}
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
              {submitLabel}
            </Text>
          )}
        </Pressable>
      </View>
    </ScreenLayout>
  );
}
