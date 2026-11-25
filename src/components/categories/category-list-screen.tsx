import { TransactionTypeSegment } from "@/components/transactions/transaction-type-segment";
import ScreenLayout from "@/components/ui/ScreenLayout";
import { useCategories } from "@/hooks/use-categories";
import { useBackendSync } from "@/hooks/useBackendSync";
import { getCategoryDisplay } from "@/lib/category-display";
import type { CategoryType } from "@/services/categories/category.types";
import { FontAwesome6 } from "@expo/vector-icons";
import { Href, Stack, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

export function CategoryListScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const isFirstFocus = useRef(true);
  const [type, setType] = useState<CategoryType>("expense");
  const { currentWorkspace } = useBackendSync();
  const { categories, isLoading, error, refresh } = useCategories({
    workspaceId: currentWorkspace?.id,
  });

  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }

      void refresh();
    }, [refresh]),
  );

  const visibleCategories = useMemo(
    () => categories.filter((category) => category.type === type),
    [categories, type],
  );

  return (
    <>
      <Stack.Screen options={{ title: t("categories.title") }} />
      <ScreenLayout background="modal" edges={["bottom"]} className="flex-1">
        <View className="px-6 pt-4">
          <TransactionTypeSegment value={type} onChange={setType} />
        </View>

        {isLoading && categories.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="hsl(144, 16%, 37%)" />
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center gap-4 px-6">
            <Text className="text-center text-base text-destructive">
              {t("categories.errors.loadFailed")}
            </Text>
            <Pressable
              className="rounded-2xl bg-brand px-5 py-3"
              onPress={() => void refresh()}
              accessibilityRole="button"
            >
              <Text className="font-semibold text-brand-foreground">
                {t("categories.retry")}
              </Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView
            className="flex-1 px-6"
            contentContainerClassName="gap-3 pb-8 pt-4"
            showsVerticalScrollIndicator={false}
          >
            {visibleCategories.length === 0 ? (
              <Text className="py-8 text-center text-sm text-muted-foreground">
                {t("categories.empty")}
              </Text>
            ) : null}

            {visibleCategories.map((category) => {
              const display = getCategoryDisplay(category);

              return (
                <Pressable
                  key={category.id}
                  className="flex-row items-center rounded-2xl border border-border bg-card px-4 py-3 active:opacity-80"
                  onPress={() =>
                    router.push(`/profile/categories/${category.id}/edit` as Href)
                  }
                  accessibilityRole="button"
                  accessibilityLabel={t("categories.editLabel", {
                    name: category.name,
                  })}
                >
                  <View
                    className={`size-10 items-center justify-center rounded-full ${display.iconBackgroundClassName}`}
                  >
                    <FontAwesome6
                      name={display.icon}
                      size={16}
                      color={display.iconColor}
                    />
                  </View>
                  <Text className="ml-3 flex-1 text-base font-semibold text-card-foreground">
                    {category.name}
                  </Text>
                  <FontAwesome6 name="chevron-right" size={12} color="#64748B" />
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        <View className="bg-card px-6 pb-6 pt-4">
          <Pressable
            className="flex-row items-center justify-center gap-2 rounded-2xl bg-brand py-4"
            onPress={() =>
              router.push(`/profile/categories/new?type=${type}` as Href)
            }
            accessibilityRole="button"
            accessibilityLabel={t("categories.add")}
          >
            <FontAwesome6 name="plus" size={14} color="#FFFFFF" />
            <Text className="text-base font-semibold text-brand-foreground">
              {t("categories.add")}
            </Text>
          </Pressable>
        </View>
      </ScreenLayout>
    </>
  );
}
