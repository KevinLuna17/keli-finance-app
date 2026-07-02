import { ApiError } from "@/lib/api/client";
import { EMPTY_STATISTICS } from "@/lib/statistics-helpers";
import {
  getExpensesByCategory,
  getIncomeByCategory,
  getMonthly,
  getSummary,
} from "@/services/analytics/analytics.service";
import { StatisticsAnalytics } from "@/services/analytics/analytics.types";
import { useAuth } from "@clerk/expo";
import { useCallback, useEffect, useRef, useState } from "react";

export function useStatisticsAnalytics(workspaceId: string | undefined) {
  const { getToken } = useAuth();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  const [data, setData] = useState<StatisticsAnalytics>(EMPTY_STATISTICS);
  const [isLoading, setIsLoading] = useState(Boolean(workspaceId));
  const [error, setError] = useState<string | null>(null);

  const loadStatistics = useCallback(async () => {
    if (!workspaceId) {
      setData(EMPTY_STATISTICS);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const tokenGetter = () => getTokenRef.current();
      const [summary, monthly, expensesByCategory, incomeByCategory] =
        await Promise.all([
          getSummary(tokenGetter, workspaceId),
          getMonthly(tokenGetter, workspaceId),
          getExpensesByCategory(tokenGetter, workspaceId),
          getIncomeByCategory(tokenGetter, workspaceId),
        ]);

      setData({
        summary,
        monthly,
        expensesByCategory,
        incomeByCategory,
      });
    } catch (loadError) {
      setError(
        loadError instanceof ApiError
          ? loadError.message
          : "Could not load statistics",
      );
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  return {
    data,
    isLoading,
    error,
    refresh: loadStatistics,
  };
}
