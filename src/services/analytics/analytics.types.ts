import { Transaction } from "@/services/transactions/transaction.types";

export type WorkspaceDashboard = {
  balanceInCents: number;
  totalIncomeInCents: number;
  totalExpensesInCents: number;
  recentTransactions: Transaction[];
};

export const ANALYTICS_ENDPOINTS = {
  dashboard: "/analytics/dashboard",
} as const;

export type GetToken = () => Promise<string | null>;
