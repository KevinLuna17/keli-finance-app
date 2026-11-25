import { ApiError } from "@/lib/api/client";
import { DEFAULT_CURRENCY } from "@/lib/currencies";
import { updateWorkspaceCurrency } from "@/services/workspaces/workspace.service";
import { useBackendSync } from "@/hooks/useBackendSync";
import { useAuth } from "@clerk/expo";
import { useCallback, useState } from "react";

const CURRENCY_LOCKED_CODE = "WORKSPACE_CURRENCY_LOCKED";

type UseWorkspaceCurrencyResult = {
  currentCurrency: string;
  isSaving: boolean;
  /** Translation key, never a raw backend message. */
  errorKey: string | null;
  selectCurrency: (currency: string) => Promise<void>;
  dismissError: () => void;
};

/**
 * Manages workspace currency changes for a given workspace.
 * On success, refreshes the workspace list so every monetary display
 * updates to the new currency immediately.
 * On failure, exposes a translation key (WORKSPACE_CURRENCY_LOCKED has its own).
 */
export function useWorkspaceCurrency(
  workspaceId: string,
): UseWorkspaceCurrencyResult {
  const { getToken } = useAuth();
  const { workspaces, refreshWorkspaces } = useBackendSync();
  const [isSaving, setIsSaving] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const workspace = workspaces.find((ws) => ws.id === workspaceId);
  const currentCurrency = workspace?.currency ?? DEFAULT_CURRENCY;

  const selectCurrency = useCallback(
    async (currency: string) => {
      if (currency === currentCurrency) {
        return;
      }

      setErrorKey(null);
      setIsSaving(true);

      try {
        await updateWorkspaceCurrency(() => getToken(), workspaceId, {
          currency,
        });
        await refreshWorkspaces();
      } catch (err) {
        setErrorKey(
          err instanceof ApiError && err.code === CURRENCY_LOCKED_CODE
            ? "workspaces.errors.currencyLocked"
            : "workspaces.errors.currencyGeneric",
        );
      } finally {
        setIsSaving(false);
      }
    },
    [currentCurrency, getToken, workspaceId, refreshWorkspaces],
  );

  const dismissError = useCallback(() => setErrorKey(null), []);

  return { currentCurrency, isSaving, errorKey, selectCurrency, dismissError };
}
