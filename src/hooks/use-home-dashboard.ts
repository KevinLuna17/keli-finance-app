import { ApiError } from "@/lib/api/client";
import { getDashboard } from "@/services/analytics/analytics.service";
import { WorkspaceDashboard } from "@/services/analytics/analytics.types";
import { MOCK_WORKSPACE_ID } from "@/mocks/workspace";
import { useAuth } from "@clerk/expo";
import { useCallback, useEffect, useRef, useState } from "react";

const EMPTY_DASHBOARD: WorkspaceDashboard = {
  balanceInCents: 0,
  totalIncomeInCents: 0,
  totalExpensesInCents: 0,
  recentTransactions: [],
};

export function useHomeDashboard(workspaceId = MOCK_WORKSPACE_ID) {
  const { getToken } = useAuth();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  const [dashboard, setDashboard] = useState<WorkspaceDashboard>(EMPTY_DASHBOARD);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getDashboard(
        () => getTokenRef.current(),
        workspaceId,
      );

      setDashboard(data);
    } catch (loadError) {
      setError(
        loadError instanceof ApiError
          ? loadError.message
          : "Could not load dashboard",
      );
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return {
    dashboard,
    isLoading,
    error,
    refresh: loadDashboard,
  };
}
