import { Transaction } from "@/services/transactions/transaction.types";

export type WorkspaceDashboard = {
  balanceInCents: number;
  totalIncomeInCents: number;
  totalExpensesInCents: number;
  recentTransactions: Transaction[];
};

export type AnalyticsSummary = {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  savings: number;
};

export type MonthlyAnalyticsItem = {
  year: number;
  /** 1-12, already grouped by the user's timezone on the backend. */
  month: number;
  income: number;
  expense: number;
};

export type CategoryAnalyticsItem = {
  categoryId: string;
  categoryName: string;
  amount: number;
};

export type StatisticsAnalytics = {
  summary: AnalyticsSummary;
  monthly: MonthlyAnalyticsItem[];
  expensesByCategory: CategoryAnalyticsItem[];
  incomeByCategory: CategoryAnalyticsItem[];
};

export const ANALYTICS_ENDPOINTS = {
  dashboard: "/analytics/dashboard",
  summary: "/analytics/summary",
  monthly: "/analytics/monthly",
  expensesByCategory: "/analytics/expenses-by-category",
  incomeByCategory: "/analytics/income-by-category",
} as const;

export type GetToken = () => Promise<string | null>;
