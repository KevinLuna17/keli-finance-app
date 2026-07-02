import { SummaryCard } from "@/components/analytics";
import { useCurrency } from "@/hooks/use-currency";
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
  const currency = useCurrency();

  return (
    <View className="flex-row flex-wrap gap-3">
      <SummaryCard
        label={t("statistics.balance")}
        amountInSmallestUnits={summary.balance}
        currency={currency}
        icon="wallet"
        accent="brand"
        isLoading={isLoading}
      />
      <SummaryCard
        label={t("statistics.income")}
        amountInSmallestUnits={summary.totalIncome}
        currency={currency}
        icon="arrow-down"
        accent="success"
        isLoading={isLoading}
      />
      <SummaryCard
        label={t("statistics.expenses")}
        amountInSmallestUnits={summary.totalExpenses}
        currency={currency}
        icon="arrow-up"
        accent="destructive"
        isLoading={isLoading}
      />
      <SummaryCard
        label={t("statistics.savings")}
        amountInSmallestUnits={summary.savings}
        currency={currency}
        icon="piggy-bank"
        accent="accent"
        isLoading={isLoading}
      />
    </View>
  );
}
