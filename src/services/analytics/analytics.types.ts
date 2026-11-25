import { Transaction } from "@/services/transactions/transaction.types";

export type WorkspaceDashboard = {
  balanceInCents: number;
  totalIncomeInCents: number;
  totalExpensesInCents: number;
  recentTransactions: Transaction[];
};

export type SavingsSummary = {
  /** Current calendar month in the user's timezone. */
  period: { year: number; month: number };
  incomeInCents: number;
  expensesInCents: number;
  /** Income minus expenses for the period. Negative when spending exceeds income. */
  savingsInCents: number;
  /** Percentage with one decimal (e.g. 25.5). Null when there is no income. */
  savingsRate: number | null;
};

export type AnalyticsSummary = {
  /** All-time income minus all-time expenses. */
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  savings: SavingsSummary;
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
