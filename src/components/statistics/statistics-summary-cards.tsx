import { SummaryCard } from "@/components/analytics";
import { formatMonthName, formatSavingsRate } from "@/lib/statistics-helpers";
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
  const { t, i18n } = useTranslation();
  const { period, savingsInCents, savingsRate } = summary.savings;
  const monthName = formatMonthName(period.year, period.month, i18n.language);
  const savingsCaption =
    savingsRate === null
      ? t("statistics.savingsNoIncome", { month: monthName })
      : t("statistics.savingsCaption", {
          month: monthName,
          rate: formatSavingsRate(savingsRate, i18n.language),
        });

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
        amountInSmallestUnits={savingsInCents}
        caption={savingsCaption}
        icon="piggy-bank"
        accent="accent"
        isLoading={isLoading}
      />
    </View>
  );
}
