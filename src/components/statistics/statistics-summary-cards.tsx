import { SummaryCard } from "@/components/analytics";
import { AnalyticsSummary } from "@/services/analytics/analytics.types";
import React from "react";
import { View } from "react-native";

type StatisticsSummaryCardsProps = {
  summary: AnalyticsSummary;
  isLoading?: boolean;
};

export function StatisticsSummaryCards({
  summary,
  isLoading = false,
}: StatisticsSummaryCardsProps) {
  return (
    <View className="flex-row flex-wrap gap-3">
      <SummaryCard
        label="Balance"
        amountInSmallestUnits={summary.balance}
        icon="wallet"
        accent="brand"
        isLoading={isLoading}
      />
      <SummaryCard
        label="Income"
        amountInSmallestUnits={summary.totalIncome}
        icon="arrow-down"
        accent="success"
        isLoading={isLoading}
      />
      <SummaryCard
        label="Expenses"
        amountInSmallestUnits={summary.totalExpenses}
        icon="arrow-up"
        accent="destructive"
        isLoading={isLoading}
      />
      <SummaryCard
        label="Savings"
        amountInSmallestUnits={summary.savings}
        icon="piggy-bank"
        accent="accent"
        isLoading={isLoading}
      />
    </View>
  );
}
