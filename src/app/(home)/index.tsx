import BalanceCard from "@/components/home/balance-card";
import RecentActivitySection from "@/components/home/recent-activity-section";
import { TransactionsErrorState } from "@/components/transactions/transactions-error-state";
import ScreenLayout from "@/components/ui/ScreenLayout";
import { useHomeDashboard } from "@/hooks/use-home-dashboard";
import { useAuth, useUser } from "@clerk/expo";
import { Href, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useRef } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  const { isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const isFirstFocus = useRef(true);
  const { dashboard, isLoading, error, refresh } = useHomeDashboard();

  const displayName =
    user?.firstName ?? user?.emailAddresses[0]?.emailAddress ?? "Usuario Keli";

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
          <Text className="text-sm text-muted-foreground">
            ¡Hola de nuevo!
          </Text>
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
              label="Saldo Total"
              amountInSmallestUnits={dashboard.balanceInCents}
              incomeInSmallestUnits={dashboard.totalIncomeInCents}
              expenseInSmallestUnits={dashboard.totalExpensesInCents}
            />
          )}
        </View>

        {!isLoading ? (
          <RecentActivitySection
            title="Actividad Reciente"
            viewAllLabel="Ver todo"
            transactions={dashboard.recentTransactions}
            onViewAllPress={() => router.push("/(home)/transactions" as Href)}
          />
        ) : null}
      </ScrollView>
    </ScreenLayout>
  );
}
