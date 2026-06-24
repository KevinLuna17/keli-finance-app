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
        title="Monthly income vs expense"
        subtitle="Last 12 months"
        isLoading={isLoading}
        isEmpty={!isLoading && !hasMonthlyActivity(monthly)}
        emptyMessage="No monthly activity yet. Transactions will appear here once recorded."
      >
        <MonthlyBarChart data={monthlyChartData} />
      </AnalyticsSection>

      {showExpenseCategories ? (
        <AnalyticsSection
          title="Expenses by category"
          subtitle="Where your money goes"
          isLoading={isLoading}
          isEmpty={!isLoading && !hasCategoryActivity(expensesByCategory)}
          emptyMessage="No expense categories yet. Add expenses to see this breakdown."
          contentHeight={320}
        >
          <CategoryPieChart data={expenseChartData} height={320} />
        </AnalyticsSection>
      ) : null}

      {showIncomeCategories ? (
        <AnalyticsSection
          title="Income by category"
          subtitle="Where your money comes from"
          isLoading={isLoading}
          isEmpty={!isLoading && !hasCategoryActivity(incomeByCategory)}
          emptyMessage="No income categories yet. Add income to see this breakdown."
          contentHeight={320}
        >
          <CategoryPieChart data={incomeChartData} height={320} />
        </AnalyticsSection>
      ) : null}
    </View>
  );
}
