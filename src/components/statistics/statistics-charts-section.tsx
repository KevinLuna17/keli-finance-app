import {
  AnalyticsSection,
  CategoryPieChart,
  getChartColorFromTheme,
  useAnalyticsChartTheme,
} from "@/components/analytics";
import { StatisticsSegment } from "@/components/statistics/statistics-segment";
import {
  hasCategoryActivity,
  toCategoryChartData,
} from "@/lib/statistics-helpers";
import {
  CategoryAnalyticsItem,
  MonthlyAnalyticsItem,
} from "@/services/analytics/analytics.types";
import React, { useMemo } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

type StatisticsChartsSectionProps = {
  segment: StatisticsSegment;
  expensesByCategory: CategoryAnalyticsItem[];
  incomeByCategory: CategoryAnalyticsItem[];
  isLoading?: boolean;
};

export function StatisticsChartsSection({
  segment,
  expensesByCategory,
  incomeByCategory,
  isLoading = false,
}: StatisticsChartsSectionProps) {
  const { t } = useTranslation();
  const chartTheme = useAnalyticsChartTheme();

  const expenseChartData = useMemo(
    () =>
      toCategoryChartData(
        expensesByCategory,
        expensesByCategory.map((_, index) =>
          getChartColorFromTheme(chartTheme, index),
        ),
      ),
    [chartTheme, expensesByCategory],
  );
  const incomeChartData = useMemo(
    () =>
      toCategoryChartData(
        incomeByCategory,
        incomeByCategory.map((_, index) =>
          getChartColorFromTheme(chartTheme, index + 2),
        ),
      ),
    [chartTheme, incomeByCategory],
  );

  const isIncome = segment === "income";
  const activeCategoryData = isIncome ? incomeChartData : expenseChartData;
  const activeCategories = isIncome ? incomeByCategory : expensesByCategory;
  const categoryTitle = isIncome
    ? t("statistics.incomeByCategoryTitle")
    : t("statistics.expensesByCategoryTitle");
  const categorySubtitle = isIncome
    ? t("statistics.incomeByCategorySubtitle")
    : t("statistics.expensesByCategorySubtitle");
  const totalLabel = isIncome
    ? t("statistics.totalIncome")
    : t("statistics.totalExpenses");
  const emptyMessage = isIncome
    ? t("statistics.noIncomeCategories")
    : t("statistics.noExpenseCategories");

  return (
    <View className="gap-4">
      <AnalyticsSection
        title={categoryTitle}
        subtitle={categorySubtitle}
        isLoading={isLoading}
        isEmpty={!isLoading && !hasCategoryActivity(activeCategories)}
        emptyMessage={emptyMessage}
        contentHeight={320}
      >
        <CategoryPieChart
          data={activeCategoryData}
          height={320}
          totalLabel={totalLabel}
        />
      </AnalyticsSection>
    </View>
  );
}
