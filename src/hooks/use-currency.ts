import { DEFAULT_CURRENCY } from "@/lib/currencies";
import { useBackendSync } from "@/providers/BackendSyncProvider";

/**
 * Returns the currency code for the currently active workspace.
 * Falls back to USD when no workspace is loaded yet.
 */
export function useCurrency(): string {
  const { currentWorkspace } = useBackendSync();
  return currentWorkspace?.currency ?? DEFAULT_CURRENCY;
}
