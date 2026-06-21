import { AuthFieldError } from "@/components/auth/AuthFieldError";
import { TransactionFormFields } from "@/components/transactions/transaction-form-fields";
import ScreenLayout from "@/components/ui/ScreenLayout";
import {
  TransactionFormMode,
  useTransactionForm,
} from "@/hooks/use-transaction-form";
import { MOCK_CATEGORIES } from "@/mocks/categories";
import { MOCK_WORKSPACE_ID } from "@/mocks/workspace";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

type TransactionFormScreenProps = {
  mode: TransactionFormMode;
  transactionId?: string;
  workspaceId?: string;
};

export function TransactionFormScreen({
  mode,
  transactionId,
  workspaceId = MOCK_WORKSPACE_ID,
}: TransactionFormScreenProps) {
  const router = useRouter();
  const submitLabel =
    mode === "create" ? "Save Transaction" : "Update Transaction";

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
    workspaceId,
    onSuccess: () => router.back(),
  });

  if (isLoadingInitial) {
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

  if (loadError) {
    return (
      <ScreenLayout edges={["bottom"]} background="modal" className="px-6">
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-center text-base text-destructive">
            {loadError}
          </Text>
          <Pressable
            className="rounded-2xl bg-brand px-5 py-3"
            onPress={() => router.back()}
          >
            <Text className="font-semibold text-brand-foreground">Go back</Text>
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
          errors={form.formState.errors}
          categories={MOCK_CATEGORIES}
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
