import { AuthFieldError } from "@/components/auth/AuthFieldError";
import { CategoryIconPicker } from "@/components/categories/category-icon-picker";
import { CategoryPickerField } from "@/components/transactions/category-picker-field";
import { TransactionTypeSegment } from "@/components/transactions/transaction-type-segment";
import ScreenLayout from "@/components/ui/ScreenLayout";
import { TextField } from "@/components/ui/TextField";
import { useCategories } from "@/hooks/use-categories";
import { CategoryFormMode, useCategoryForm } from "@/hooks/use-category-form";
import { useBackendSync } from "@/hooks/useBackendSync";
import type { CategoryType } from "@/services/categories/category.types";
import { Stack, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

type CategoryFormScreenProps = {
  mode: CategoryFormMode;
  categoryId?: string;
  initialType?: CategoryType;
};

export function CategoryFormScreen({
  mode,
  categoryId,
  initialType,
}: CategoryFormScreenProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { currentWorkspace } = useBackendSync();
  const { categories, isLoading } = useCategories({
    workspaceId: currentWorkspace?.id,
  });
  const [reassignTargetId, setReassignTargetId] = useState("");

  const category =
    mode === "edit"
      ? (categories.find((item) => item.id === categoryId) ?? null)
      : null;

  const {
    form,
    onSubmit,
    removeCategory,
    needsReassign,
    cancelReassign,
    submitErrorKey,
    isSubmitting,
    isDeleting,
    isSubmitDisabled,
  } = useCategoryForm({
    mode,
    workspaceId: currentWorkspace?.id,
    category,
    initialType,
    onSuccess: () => router.back(),
    onDeleted: () => router.back(),
  });

  const reassignOptions = useMemo(
    () =>
      category
        ? categories.filter(
            (item) => item.type === category.type && item.id !== category.id,
          )
        : [],
    [categories, category],
  );

  const title =
    mode === "create" ? t("categories.newTitle") : t("categories.editTitle");
  const isBusy = isSubmitting || isDeleting;

  const confirmDelete = () => {
    Alert.alert(
      t("categories.deleteConfirmTitle"),
      t("categories.deleteConfirmMessage"),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("delete"),
          style: "destructive",
          onPress: () => {
            void removeCategory();
          },
        },
      ],
    );
  };

  if (mode === "edit" && (isLoading || !category)) {
    return (
      <>
        <Stack.Screen options={{ title }} />
        <ScreenLayout
          edges={["bottom"]}
          background="modal"
          className="items-center justify-center px-6"
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="hsl(144, 16%, 37%)" />
          ) : (
            <Text className="text-center text-base text-destructive">
              {t("categories.notFound")}
            </Text>
          )}
        </ScreenLayout>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title }} />
      <ScreenLayout edges={["bottom"]} background="modal" className="flex-1">
        <ScrollView
          className="flex-1 px-6"
          contentContainerClassName="pb-8 pt-4"
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {submitErrorKey ? (
            <View className="mb-4">
              <AuthFieldError message={t(submitErrorKey)} />
            </View>
          ) : null}

          <Text className="mb-2 text-sm font-medium text-foreground">
            {t("categories.typeLabel")}
          </Text>
          <Controller
            control={form.control}
            name="type"
            render={({ field: { value, onChange } }) => (
              <TransactionTypeSegment
                value={value}
                onChange={onChange}
                disabled={mode === "edit" || isBusy}
              />
            )}
          />
          {mode === "edit" ? (
            <Text className="mb-3 mt-2 text-xs text-muted-foreground">
              {t("categories.typeLocked")}
            </Text>
          ) : (
            <View className="mb-3" />
          )}

          <Text className="mb-2 text-sm font-medium text-foreground">
            {t("categories.nameLabel")}
          </Text>
          <Controller
            control={form.control}
            name="name"
            render={({ field: { value, onChange, onBlur }, fieldState }) => (
              <TextField
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                editable={!isBusy}
                placeholder={t("categories.namePlaceholder")}
                autoCapitalize="sentences"
                maxLength={50}
                error={
                  fieldState.error?.message
                    ? t(fieldState.error.message)
                    : undefined
                }
              />
            )}
          />

          <Controller
            control={form.control}
            name="iconKey"
            render={({ field: { value, onChange } }) => (
              <CategoryIconPicker
                label={t("categories.iconLabel")}
                value={value}
                onChange={(iconKey) => onChange(iconKey)}
                disabled={isBusy}
              />
            )}
          />

          {mode === "edit" && needsReassign ? (
            <View className="mt-6 rounded-2xl border border-destructive/40 bg-destructive/5 p-4">
              <Text className="mb-3 text-sm text-card-foreground">
                {t("categories.reassignMessage")}
              </Text>
              <CategoryPickerField
                label={t("categories.reassignLabel")}
                categories={reassignOptions}
                value={reassignTargetId}
                onChange={setReassignTargetId}
                disabled={isBusy}
              />
              <View className="mt-2 flex-row gap-3">
                <Pressable
                  className="flex-1 items-center rounded-2xl border border-border py-3"
                  onPress={cancelReassign}
                  disabled={isBusy}
                  accessibilityRole="button"
                >
                  <Text className="font-semibold text-card-foreground">
                    {t("cancel")}
                  </Text>
                </Pressable>
                <Pressable
                  className={`flex-1 items-center rounded-2xl py-3 ${
                    reassignTargetId ? "bg-destructive" : "bg-muted"
                  }`}
                  onPress={() => void removeCategory(reassignTargetId)}
                  disabled={!reassignTargetId || isBusy}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: !reassignTargetId || isBusy }}
                >
                  {isDeleting ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text
                      className={`font-semibold ${
                        reassignTargetId ? "text-white" : "text-muted-foreground"
                      }`}
                    >
                      {t("categories.moveAndDelete")}
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          ) : null}

          {mode === "edit" && !needsReassign ? (
            <Pressable
              className="mt-6 items-center rounded-2xl border border-destructive/40 py-4"
              onPress={confirmDelete}
              disabled={isBusy}
              accessibilityRole="button"
              accessibilityLabel={t("categories.delete")}
            >
              {isDeleting ? (
                <ActivityIndicator color="#DC2626" />
              ) : (
                <Text className="text-base font-semibold text-destructive">
                  {t("categories.delete")}
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
                {mode === "create"
                  ? t("categories.create")
                  : t("profileScreen.saveChanges")}
              </Text>
            )}
          </Pressable>
        </View>
      </ScreenLayout>
    </>
  );
}
