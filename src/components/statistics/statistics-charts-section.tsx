import {
  AnalyticsSection,
  CategoryPieChart,
  MonthlyBarChart,
  getChartColorFromTheme,
  useAnalyticsChartTheme,
} from "@/components/analytics";
import { StatisticsSegment } from "@/components/statistics/statistics-segment";
import {
  hasCategoryActivity,
  hasMonthlyActivity,
  toCategoryChartData,
  toMonthlyChartData,
} from "@/lib/statistics-helpers";
import {
  CategoryAnalyticsItem,
  MonthlyAnalyticsItem,
} from "@/services/analytics/analytics.types";
import React, { useMemo } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

const MONTHLY_CHART_MONTHS = 6;

type StatisticsChartsSectionProps = {
  segment: StatisticsSegment;
  monthly: MonthlyAnalyticsItem[];
  expensesByCategory: CategoryAnalyticsItem[];
  incomeByCategory: CategoryAnalyticsItem[];
  isLoading?: boolean;
};

export function StatisticsChartsSection({
  segment,
  monthly,
  expensesByCategory,
  incomeByCategory,
  isLoading = false,
}: StatisticsChartsSectionProps) {
  const { t, i18n } = useTranslation();
  const chartTheme = useAnalyticsChartTheme();

  // Twelve grouped months do not fit a phone screen; show the most recent ones.
  const recentMonthly = useMemo(
    () => monthly.slice(-MONTHLY_CHART_MONTHS),
    [monthly],
  );
  const monthlyChartData = useMemo(
    () => toMonthlyChartData(recentMonthly, i18n.language),
    [recentMonthly, i18n.language],
  );

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

  if (segment === "overview") {
    return (
      <View className="gap-4">
        <AnalyticsSection
          title={t("statistics.monthlyChartTitle")}
          subtitle={t("statistics.monthlyChartSubtitle", {
            count: MONTHLY_CHART_MONTHS,
          })}
          isLoading={isLoading}
          isEmpty={!isLoading && !hasMonthlyActivity(recentMonthly)}
          emptyMessage={t("statistics.noMonthlyActivity")}
          contentHeight={270}
        >
          <MonthlyBarChart data={monthlyChartData} />
        </AnalyticsSection>
      </View>
    );
  }

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
