import { ApiError } from "@/lib/api/client";
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
  getTokenRef.current = getToken;

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
        loadError instanceof ApiError
          ? loadError.message
          : "Could not load workspaces",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    workspaces,
    isLoading,
    error,
    refresh,
  };
}
