import { SummaryCard } from "@/components/analytics";
import { AnalyticsSummary } from "@/services/analytics/analytics.types";
import React from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

type StatisticsSummaryCardsProps = {
  summary: AnalyticsSummary;
  isLoading?: boolean;
};

export function StatisticsSummaryCards({
  summary,
  isLoading = false,
}: StatisticsSummaryCardsProps) {
  const { t } = useTranslation();

  return (
    <View className="flex-row flex-wrap gap-3">
      <SummaryCard
        label={t("statistics.balance")}
        amountInSmallestUnits={summary.balance}
        icon="wallet"
        accent="brand"
        isLoading={isLoading}
      />
      <SummaryCard
        label={t("statistics.income")}
        amountInSmallestUnits={summary.totalIncome}
        icon="arrow-down"
        accent="success"
        isLoading={isLoading}
      />
      <SummaryCard
        label={t("statistics.expenses")}
        amountInSmallestUnits={summary.totalExpenses}
        icon="arrow-up"
        accent="destructive"
        isLoading={isLoading}
      />
      <SummaryCard
        label={t("statistics.savings")}
        amountInSmallestUnits={summary.savings}
        icon="piggy-bank"
        accent="accent"
        isLoading={isLoading}
      />
    </View>
  );
}
