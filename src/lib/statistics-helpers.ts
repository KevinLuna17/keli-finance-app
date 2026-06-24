import type {
  CategoryPieChartDatum,
  MonthlyBarChartDatum,
} from "@/components/analytics";
import {
  CategoryAnalyticsItem,
  MonthlyAnalyticsItem,
  StatisticsAnalytics,
} from "@/services/analytics/analytics.types";

const EMPTY_SUMMARY = {
  balance: 0,
  totalIncome: 0,
  totalExpenses: 0,
  savings: 0,
};

export const EMPTY_STATISTICS: StatisticsAnalytics = {
  summary: EMPTY_SUMMARY,
  monthly: [],
  expensesByCategory: [],
  incomeByCategory: [],
};

export function hasMonthlyActivity(monthly: MonthlyAnalyticsItem[]): boolean {
  return monthly.some((item) => item.income > 0 || item.expense > 0);
}

export function hasCategoryActivity(
  categories: CategoryAnalyticsItem[],
): boolean {
  return categories.some((item) => item.amount > 0);
}

export function isStatisticsEmpty(data: StatisticsAnalytics): boolean {
  const { summary, monthly, expensesByCategory, incomeByCategory } = data;

  return (
    summary.totalIncome === 0 &&
    summary.totalExpenses === 0 &&
    !hasMonthlyActivity(monthly) &&
    !hasCategoryActivity(expensesByCategory) &&
    !hasCategoryActivity(incomeByCategory)
  );
}

export type {
  CategoryPieChartDatum as CategoryChartDatum,
  MonthlyBarChartDatum as MonthlyChartDatum,
} from "@/components/analytics";

export function toMonthlyChartData(
  monthly: MonthlyAnalyticsItem[],
): MonthlyBarChartDatum[] {
  return monthly.map((item) => ({
    month: item.month,
    income: item.income / 100,
    expense: item.expense / 100,
  }));
}

export function toCategoryChartData(
  categories: CategoryAnalyticsItem[],
  colors: string[],
): CategoryPieChartDatum[] {
  return categories
    .filter((item) => item.amount > 0)
    .map((item, index) => ({
      label: item.categoryName,
      value: item.amount / 100,
      color: colors[index % colors.length],
    }));
}
