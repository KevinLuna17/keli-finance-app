import { WorkspaceCurrencyList } from "@/components/profile/workspace-currency-list";
import ScreenLayout from "@/components/ui/ScreenLayout";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text } from "react-native";
import { useTranslation } from "react-i18next";

export function WorkspaceCurrencyScreen() {
  const { t } = useTranslation();
  const { id: workspaceId } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <Stack.Screen options={{ title: t("workspaces.currencyModalTitle") }} />
      <ScreenLayout background="modal" edges={["bottom"]} className="flex-1">
        <ScrollView
          className="flex-1 px-6"
          contentContainerClassName="pb-8 pt-6"
          showsVerticalScrollIndicator={false}
        >
          <Text className="mb-4 text-sm text-muted-foreground">
            {t("workspaces.currencyHint")}
          </Text>
          <WorkspaceCurrencyList workspaceId={workspaceId} />
        </ScrollView>
      </ScreenLayout>
    </>
  );
}
