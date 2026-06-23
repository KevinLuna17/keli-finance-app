import {
  apiPaginatedRequest,
  apiRequest,
  apiRequestNoContent,
} from "@/lib/api/client";
import {
  CreateTransactionRequest,
  GetToken,
  GetTransactionsParams,
  GetTransactionsResult,
  TRANSACTION_ENDPOINTS,
  Transaction,
  UpdateTransactionRequest,
} from "./transaction.types";

function buildQueryString(
  params: Record<string, string | number | undefined>,
): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      searchParams.set(key, String(value));
    }
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export function createTransaction(
  getToken: GetToken,
  workspaceId: string,
  input: CreateTransactionRequest,
): Promise<Transaction> {
  const query = buildQueryString({ workspaceId });

  return apiRequest<Transaction>(`${TRANSACTION_ENDPOINTS.base}${query}`, {
    method: "POST",
    body: input,
    getToken,
  });
}

export function getTransactions(
  getToken: GetToken,
  params: GetTransactionsParams,
): Promise<GetTransactionsResult> {
  const query = buildQueryString({
    workspaceId: params.workspaceId,
    type: params.type,
    categoryId: params.categoryId,
    startDate: params.startDate,
    endDate: params.endDate,
    page: params.page,
    limit: params.limit,
  });

  return apiPaginatedRequest<Transaction>(
    `${TRANSACTION_ENDPOINTS.base}${query}`,
    {
      method: "GET",
      getToken,
    },
  );
}

export function getTransaction(
  getToken: GetToken,
  id: string,
): Promise<Transaction> {
  return apiRequest<Transaction>(TRANSACTION_ENDPOINTS.byId(id), {
    method: "GET",
    getToken,
  });
}

export function updateTransaction(
  getToken: GetToken,
  id: string,
  input: UpdateTransactionRequest,
): Promise<Transaction> {
  return apiRequest<Transaction>(TRANSACTION_ENDPOINTS.byId(id), {
    method: "PATCH",
    body: input,
    getToken,
  });
}

export function deleteTransaction(
  getToken: GetToken,
  id: string,
): Promise<void> {
  return apiRequestNoContent(TRANSACTION_ENDPOINTS.byId(id), {
    method: "DELETE",
    getToken,
  });
}
