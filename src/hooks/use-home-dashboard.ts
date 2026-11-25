import { getApiErrorMessage } from "@/lib/api/api-error-message";
import { getDashboard } from "@/services/analytics/analytics.service";
import { WorkspaceDashboard } from "@/services/analytics/analytics.types";
import { useAuth } from "@clerk/expo";
import { useCallback, useEffect, useRef, useState } from "react";

const EMPTY_DASHBOARD: WorkspaceDashboard = {
  balanceInCents: 0,
  totalIncomeInCents: 0,
  totalExpensesInCents: 0,
  recentTransactions: [],
};

export function useHomeDashboard(workspaceId: string | undefined) {
  const { getToken } = useAuth();
  const getTokenRef = useRef(getToken);
  useEffect(() => {
    getTokenRef.current = getToken;
  });

  const [dashboard, setDashboard] = useState<WorkspaceDashboard>(EMPTY_DASHBOARD);
  const [isLoading, setIsLoading] = useState(Boolean(workspaceId));
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    if (!workspaceId) {
      setDashboard(EMPTY_DASHBOARD);
      setIsLoading(false);
      return;
    }

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
        getApiErrorMessage(loadError, "errors.loadDashboard"),
      );
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional data fetch on mount
    loadDashboard();
  }, [loadDashboard]);

  return {
    dashboard,
    isLoading,
    error,
    refresh: loadDashboard,
  };
}
