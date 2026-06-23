export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  workspaceId: string;
  categoryId: string;
  createdBy: string;
  type: TransactionType;
  amountInCents: number;
  description: string;
  transactionDate: string;
  createdAt: string;
  updatedAt: string | null;
};

export type CreateTransactionRequest = {
  categoryId: string;
  type: TransactionType;
  amountInCents: number;
  description: string;
  transactionDate: string;
};

export type UpdateTransactionRequest = {
  categoryId?: string;
  type?: TransactionType;
  amountInCents?: number;
  description?: string;
  transactionDate?: string;
};

export type GetTransactionsParams = {
  workspaceId: string;
  type?: TransactionType;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
};

export type GetTransactionsResult = {
  data: Transaction[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
};

export const TRANSACTION_ENDPOINTS = {
  base: "/transactions",
  byId: (id: string) => `/transactions/${id}`,
} as const;

export type GetToken = () => Promise<string | null>;
