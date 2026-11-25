import { getApiErrorMessage } from "@/lib/api/api-error-message";
import { listWorkspaces } from "@/services/workspaces/workspace.service";
import type { Workspace } from "@/services/workspaces/workspace.types";
import { useAuth } from "@clerk/expo";
import { useCallback, useEffect, useRef, useState } from "react";

export type UseWorkspacesResult = {
  workspaces: Workspace[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useWorkspaces(): UseWorkspacesResult {
  const { getToken } = useAuth();
  const getTokenRef = useRef(getToken);
  useEffect(() => {
    getTokenRef.current = getToken;
  });

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await listWorkspaces(() => getTokenRef.current());
      setWorkspaces(data);
    } catch (loadError) {
      setError(
        getApiErrorMessage(loadError, "errors.loadWorkspaces"),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional data fetch on mount
    refresh();
  }, [refresh]);

  return {
    workspaces,
    isLoading,
    error,
    refresh,
  };
}
