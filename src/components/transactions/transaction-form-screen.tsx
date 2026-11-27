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
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

type TransactionFormScreenProps = {
  mode: TransactionFormMode;
  transactionId?: string;
  initialType?: "income" | "expense";
  /** Defaults to closing the modal. */
  onSuccess?: () => void | Promise<void>;
};

export function TransactionFormScreen({
  mode,
  transactionId,
  initialType,
  onSuccess,
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
    removeTransaction,
    submitError,
    loadError,
    isLoadingInitial,
    isSubmitting,
    isDeleting,
    isSubmitDisabled,
  } = useTransactionForm({
    mode,
    transactionId,
    workspaceId: workspaceId ?? "",
    initialType,
    onSuccess: onSuccess ?? (() => router.back()),
  });

  const confirmDelete = () => {
    Alert.alert(
      t("transactionForm.deleteConfirmTitle"),
      t("transactionForm.deleteConfirmMessage"),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("delete"),
          style: "destructive",
          onPress: () => {
            void removeTransaction();
          },
        },
      ],
    );
  };

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
          disabled={isSubmitting || isDeleting}
        />

        {mode === "edit" ? (
          <Pressable
            className="mt-6 items-center rounded-2xl border border-destructive/40 py-4"
            onPress={confirmDelete}
            disabled={isSubmitting || isDeleting}
            accessibilityRole="button"
            accessibilityLabel={t("transactionForm.delete")}
          >
            {isDeleting ? (
              <ActivityIndicator color="#DC2626" />
            ) : (
              <Text className="text-base font-semibold text-destructive">
                {t("transactionForm.delete")}
              </Text>
            )}
          </Pressable>
        ) : null}
      </ScrollView>

      <View className="bg-card px-6 pb-6 pt-4">
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: isSubmitDisabled }}
          disabled={isSubmitDisabled}
          onPress={() => onSubmit()}
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
