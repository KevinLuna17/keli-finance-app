import type {
  CategoryPieChartDatum,
  MonthlyBarChartDatum,
} from "@/components/analytics";
import {
  AnalyticsSummary,
  CategoryAnalyticsItem,
  MonthlyAnalyticsItem,
  StatisticsAnalytics,
} from "@/services/analytics/analytics.types";

const EMPTY_SUMMARY: AnalyticsSummary = {
  balance: 0,
  totalIncome: 0,
  totalExpenses: 0,
  savings: {
    period: { year: new Date().getFullYear(), month: new Date().getMonth() + 1 },
    incomeInCents: 0,
    expensesInCents: 0,
    savingsInCents: 0,
    savingsRate: null,
  },
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

/** Short month name in the given language, e.g. "Nov" / "nov". */
export function formatMonthLabel(
  year: number,
  month: number,
  language: string,
): string {
  // Mid-month at UTC noon so no timezone can shift it to another month.
  const date = new Date(Date.UTC(year, month - 1, 15, 12));

  return new Intl.DateTimeFormat(language, {
    month: "short",
    timeZone: "UTC",
  }).format(date);
}

/** Full month name in the given language, capitalized, e.g. "November" / "Noviembre". */
export function formatMonthName(
  year: number,
  month: number,
  language: string,
): string {
  const date = new Date(Date.UTC(year, month - 1, 15, 12));
  const name = new Intl.DateTimeFormat(language, {
    month: "long",
    timeZone: "UTC",
  }).format(date);

  return name.charAt(0).toLocaleUpperCase(language) + name.slice(1);
}

/** Savings rate (already a percentage) formatted for display, e.g. "25.5 %". */
export function formatSavingsRate(rate: number, language: string): string {
  return new Intl.NumberFormat(language, {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(rate / 100);
}

export function toMonthlyChartData(
  monthly: MonthlyAnalyticsItem[],
  language: string,
): MonthlyBarChartDatum[] {
  return monthly.map((item) => ({
    month: formatMonthLabel(item.year, item.month, language),
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
