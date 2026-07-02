import {
  AnalyticsSection,
  CategoryPieChart,
  getChartColorFromTheme,
  MonthlyBarChart,
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
  const { t } = useTranslation();
  const chartTheme = useAnalyticsChartTheme();

  const monthlyChartData = useMemo(() => toMonthlyChartData(monthly), [monthly]);
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

  const showExpenseCategories =
    segment === "overview" || segment === "expense";
  const showIncomeCategories = segment === "overview" || segment === "income";

  return (
    <View className="gap-4">
      <AnalyticsSection
        title={t("statistics.monthlyChartTitle")}
        subtitle={t("statistics.monthlyChartSubtitle")}
        isLoading={isLoading}
        isEmpty={!isLoading && !hasMonthlyActivity(monthly)}
        emptyMessage={t("statistics.noMonthlyActivity")}
      >
        <MonthlyBarChart data={monthlyChartData} />
      </AnalyticsSection>

      {showExpenseCategories ? (
        <AnalyticsSection
          title={t("statistics.expensesByCategoryTitle")}
          subtitle={t("statistics.expensesByCategorySubtitle")}
          isLoading={isLoading}
          isEmpty={!isLoading && !hasCategoryActivity(expensesByCategory)}
          emptyMessage={t("statistics.noExpenseCategories")}
          contentHeight={320}
        >
          <CategoryPieChart data={expenseChartData} height={320} />
        </AnalyticsSection>
      ) : null}

      {showIncomeCategories ? (
        <AnalyticsSection
          title={t("statistics.incomeByCategoryTitle")}
          subtitle={t("statistics.incomeByCategorySubtitle")}
          isLoading={isLoading}
          isEmpty={!isLoading && !hasCategoryActivity(incomeByCategory)}
          emptyMessage={t("statistics.noIncomeCategories")}
          contentHeight={320}
        >
          <CategoryPieChart data={incomeChartData} height={320} />
        </AnalyticsSection>
      ) : null}
    </View>
  );
}
