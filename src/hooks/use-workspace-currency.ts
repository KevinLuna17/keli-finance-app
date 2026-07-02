import { ApiError } from "@/lib/api/client";
import { DEFAULT_CURRENCY } from "@/lib/currencies";
import { updateWorkspaceCurrency } from "@/services/workspaces/workspace.service";
import { useBackendSync } from "@/hooks/useBackendSync";
import { useAuth } from "@clerk/expo";
import { useCallback, useState } from "react";

type UseWorkspaceCurrencyResult = {
  currentCurrency: string;
  isSaving: boolean;
  error: string | null;
  selectCurrency: (currency: string) => Promise<void>;
  dismissError: () => void;
};

/**
 * Manages workspace currency changes for a given workspace.
 * On success, refreshes the workspace list so every monetary display
 * updates to the new currency immediately.
 * On failure (e.g. WORKSPACE_CURRENCY_LOCKED), surfaces the backend
 * error message directly — no transformation needed since the backend
 * already returns a user-friendly message.
 */
export function useWorkspaceCurrency(
  workspaceId: string,
): UseWorkspaceCurrencyResult {
  const { getToken } = useAuth();
  const { workspaces, refreshWorkspaces } = useBackendSync();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const workspace = workspaces.find((ws) => ws.id === workspaceId);
  const currentCurrency = workspace?.currency ?? DEFAULT_CURRENCY;

  const selectCurrency = useCallback(
    async (currency: string) => {
      if (currency === currentCurrency) {
        return;
      }

      setError(null);
      setIsSaving(true);

      try {
        await updateWorkspaceCurrency(() => getToken(), workspaceId, {
          currency,
        });
        await refreshWorkspaces();
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err.message
            : "Could not update workspace currency",
        );
      } finally {
        setIsSaving(false);
      }
    },
    [currentCurrency, getToken, workspaceId, refreshWorkspaces],
  );

  const dismissError = useCallback(() => setError(null), []);

  return { currentCurrency, isSaving, error, selectCurrency, dismissError };
}
