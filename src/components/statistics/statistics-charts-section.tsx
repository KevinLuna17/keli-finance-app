import { CategoryBreakdownChart } from "@/components/statistics/category-breakdown-chart";
import { MonthlyIncomeExpenseChart } from "@/components/statistics/monthly-income-expense-chart";
import { StatisticsChartCard } from "@/components/statistics/statistics-chart-card";
import {
  StatisticsSegment,
} from "@/components/statistics/statistics-segment";
import { getChartColor } from "@/lib/chart-colors";
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
  const monthlyChartData = useMemo(() => toMonthlyChartData(monthly), [monthly]);
  const expenseChartData = useMemo(
    () =>
      toCategoryChartData(
        expensesByCategory,
        expensesByCategory.map((_, index) => getChartColor(index)),
      ),
    [expensesByCategory],
  );
  const incomeChartData = useMemo(
    () =>
      toCategoryChartData(
        incomeByCategory,
        incomeByCategory.map((_, index) => getChartColor(index + 2)),
      ),
    [incomeByCategory],
  );

  const showExpenseCategories =
    segment === "overview" || segment === "expense";
  const showIncomeCategories = segment === "overview" || segment === "income";

  return (
    <View className="gap-4">
      <StatisticsChartCard
        title="Monthly income vs expense"
        subtitle="Last 12 months"
        isLoading={isLoading}
        isEmpty={!isLoading && !hasMonthlyActivity(monthly)}
        emptyMessage="No monthly activity yet. Transactions will appear here once recorded."
      >
        <MonthlyIncomeExpenseChart data={monthlyChartData} />
      </StatisticsChartCard>

      {showExpenseCategories ? (
        <StatisticsChartCard
          title="Expenses by category"
          subtitle="Where your money goes"
          isLoading={isLoading}
          isEmpty={!isLoading && !hasCategoryActivity(expensesByCategory)}
          emptyMessage="No expense categories yet. Add expenses to see this breakdown."
          chartHeight={320}
        >
          <CategoryBreakdownChart data={expenseChartData} height={320} />
        </StatisticsChartCard>
      ) : null}

      {showIncomeCategories ? (
        <StatisticsChartCard
          title="Income by category"
          subtitle="Where your money comes from"
          isLoading={isLoading}
          isEmpty={!isLoading && !hasCategoryActivity(incomeByCategory)}
          emptyMessage="No income categories yet. Add income to see this breakdown."
          chartHeight={320}
        >
          <CategoryBreakdownChart data={incomeChartData} height={320} />
        </StatisticsChartCard>
      ) : null}
    </View>
  );
}
