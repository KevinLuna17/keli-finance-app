import BalanceCard from "@/components/home/balance-card";
import RecentActivitySection from "@/components/home/recent-activity-section";
import { TransactionsErrorState } from "@/components/transactions/transactions-error-state";
import ScreenLayout from "@/components/ui/ScreenLayout";
import { useCategories } from "@/hooks/use-categories";
import { useHomeDashboard } from "@/hooks/use-home-dashboard";
import { useBackendSync } from "@/hooks/useBackendSync";
import { buildCategoryLookup } from "@/lib/category-display";
import { useAuth, useUser } from "@clerk/expo";
import { Href, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

export default function HomeScreen() {
  const { t } = useTranslation();
  const { isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const isFirstFocus = useRef(true);
  const { currentWorkspace } = useBackendSync();
  const workspaceId = currentWorkspace?.id;
  const workspaceCurrency = currentWorkspace?.currency;
  const { dashboard, isLoading, error, refresh } =
    useHomeDashboard(workspaceId);
  const { categories } = useCategories({ workspaceId });

  const categoryLookup = useMemo(
    () => buildCategoryLookup(categories),
    [categories],
  );

  const displayName =
    user?.fullName ?? user?.emailAddresses[0]?.emailAddress ?? t("dashboard.defaultName");

  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }

      refresh();
    }, [refresh]),
  );

  if (!isLoaded) {
    return (
      <ScreenLayout className="items-center justify-center">
        <ActivityIndicator size="large" color="hsl(144, 16%, 37%)" />
      </ScreenLayout>
    );
  }

  if (error && !isLoading) {
    return (
      <ScreenLayout edges={["top"]} background="custom" className="flex-1">
        <TransactionsErrorState message={error} onRetry={refresh} />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout edges={["top"]} background="custom" className="flex-1">
      <ScrollView
        className="flex-1 px-6"
        contentContainerClassName="pb-8 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text className="text-sm text-muted-foreground">{t("dashboard.greeting")}</Text>
          <Text className="mt-1 text-2xl font-bold text-foreground">
            {displayName}
          </Text>
        </View>

        <View className="mt-6">
          {isLoading ? (
            <View className="items-center justify-center rounded-3xl bg-brand py-16">
              <ActivityIndicator color="#FFFFFF" />
            </View>
          ) : (
            <BalanceCard
              label={t("dashboard.totalBalance")}
              amountInSmallestUnits={dashboard.balanceInCents}
              incomeInSmallestUnits={dashboard.totalIncomeInCents}
              expenseInSmallestUnits={dashboard.totalExpensesInCents}
              currency={workspaceCurrency}
            />
          )}
        </View>

        {!isLoading ? (
          <RecentActivitySection
            title={t("dashboard.recentActivity")}
            viewAllLabel={t("dashboard.seeAll")}
            transactions={dashboard.recentTransactions}
            categoryLookup={categoryLookup}
            currency={workspaceCurrency}
            onViewAllPress={() => router.push("/(home)/transactions" as Href)}
          />
        ) : null}
      </ScrollView>
    </ScreenLayout>
  );
}
