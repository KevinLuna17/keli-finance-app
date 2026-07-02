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
  month: string;
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
