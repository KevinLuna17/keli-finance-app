import { ApiError } from "@/lib/api/client";
import {
  buildTransactionListRows,
  mergeTransactions,
} from "@/lib/transaction-list-utils";
import { getTransactions } from "@/services/transactions/transaction.service";
import { Transaction } from "@/services/transactions/transaction.types";
import { useAuth } from "@clerk/expo";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const PAGE_LIMIT = 20;

type ListStatus = "loading" | "refreshing" | "loadingMore" | "success" | "error";

type UseTransactionsListOptions = {
  workspaceId: string;
};

export function useTransactionsList({ workspaceId }: UseTransactionsListOptions) {
  const { getToken } = useAuth();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<ListStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const hasMore = transactions.length < total;

  const rows = useMemo(
    () => buildTransactionListRows(transactions),
    [transactions],
  );

  const fetchPage = useCallback(
    async (nextPage: number, mode: "initial" | "refresh" | "more") => {
      const requestId = ++requestIdRef.current;

      if (mode === "initial") {
        setStatus("loading");
      } else if (mode === "refresh") {
        setStatus("refreshing");
      } else {
        setStatus("loadingMore");
      }

      setError(null);

      try {
        const result = await getTransactions(() => getTokenRef.current(), {
          workspaceId,
          page: nextPage,
          limit: PAGE_LIMIT,
        });

        if (requestId !== requestIdRef.current) {
          return;
        }

        setTotal(result.meta.total);
        setPage(nextPage);
        setTransactions((current) =>
          mode === "more"
            ? mergeTransactions(current, result.data)
            : result.data,
        );
        setStatus("success");
      } catch (fetchError) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setError(
          fetchError instanceof ApiError
            ? fetchError.message
            : "Could not load transactions",
        );
        setStatus("error");
      }
    },
    [workspaceId],
  );

  const refresh = useCallback(() => {
    fetchPage(1, "refresh");
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (status === "loadingMore" || status === "loading" || !hasMore) {
      return;
    }

    fetchPage(page + 1, "more");
  }, [fetchPage, hasMore, page, status]);

  const retry = useCallback(() => {
    if (transactions.length === 0) {
      fetchPage(1, "initial");
      return;
    }

    refresh();
  }, [fetchPage, refresh, transactions.length]);

  useEffect(() => {
    fetchPage(1, "initial");
  }, [fetchPage]);

  return {
    rows,
    transactions,
    total,
    status,
    error,
    hasMore,
    refresh,
    loadMore,
    retry,
    isInitialLoading: status === "loading" && transactions.length === 0,
    isRefreshing: status === "refreshing",
    isLoadingMore: status === "loadingMore",
    isEmpty: status === "success" && transactions.length === 0,
    hasError: status === "error",
  };
}
