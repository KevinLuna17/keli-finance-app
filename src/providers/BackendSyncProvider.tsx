import { syncUser } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { DEFAULT_CURRENCY } from "@/lib/currencies";
import { detectDeviceRegion, detectDeviceTimezone } from "@/lib/region";
import { listWorkspaces } from "@/services/workspaces/workspace.service";
import type { CurrentWorkspace } from "@/services/workspaces/workspace.types";
import type { BackendUser } from "@/types/api";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { useAuth } from "@clerk/expo";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type SyncStatus = "idle" | "syncing" | "synced" | "error";

type BackendSyncContextValue = {
  status: SyncStatus;
  error: string | null;
  backendUser: BackendUser | null;
  workspaces: CurrentWorkspace[];
  currentWorkspace: CurrentWorkspace | null;
  refreshWorkspaces: () => Promise<void>;
  retry: () => void;
  isBootstrapping: boolean;
};

const BackendSyncContext = createContext<BackendSyncContextValue | null>(null);

function toCurrentWorkspace(
  workspace: Awaited<ReturnType<typeof listWorkspaces>>[number],
): CurrentWorkspace {
  return {
    id: workspace.id,
    name: workspace.name,
    type: workspace.type,
    currency: workspace.currency ?? DEFAULT_CURRENCY,
    role: workspace.role,
  };
}

function resolveActiveWorkspaceId(
  workspaces: CurrentWorkspace[],
  storedWorkspaceId: string | null,
): string | null {
  if (workspaces.length === 0) {
    return null;
  }

  if (
    storedWorkspaceId &&
    workspaces.some((workspace) => workspace.id === storedWorkspaceId)
  ) {
    return storedWorkspaceId;
  }

  const personalWorkspace = workspaces.find(
    (workspace) => workspace.type === "personal",
  );

  return personalWorkspace?.id ?? workspaces[0]?.id ?? null;
}

export function BackendSyncProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const getTokenRef = useRef(getToken);
  const syncInFlightRef = useRef(false);
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);
  const [workspaces, setWorkspaces] = useState<CurrentWorkspace[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const currentWorkspaceId = useWorkspaceStore(
    (state) => state.currentWorkspaceId,
  );
  const setCurrentWorkspaceId = useWorkspaceStore(
    (state) => state.setCurrentWorkspaceId,
  );
  const resetWorkspaceStore = useWorkspaceStore((state) => state.reset);

  getTokenRef.current = getToken;

  const applyWorkspaces = useCallback(
    (nextWorkspaces: CurrentWorkspace[]) => {
      setWorkspaces(nextWorkspaces);

      const activeWorkspaceId = resolveActiveWorkspaceId(
        nextWorkspaces,
        useWorkspaceStore.getState().currentWorkspaceId,
      );

      if (
        activeWorkspaceId &&
        activeWorkspaceId !== useWorkspaceStore.getState().currentWorkspaceId
      ) {
        setCurrentWorkspaceId(activeWorkspaceId);
      }
    },
    [setCurrentWorkspaceId],
  );

  const refreshWorkspaces = useCallback(async () => {
    const nextWorkspaces = await listWorkspaces(() => getTokenRef.current());
    applyWorkspaces(nextWorkspaces.map(toCurrentWorkspace));
  }, [applyWorkspaces]);

  const retry = useCallback(() => {
    syncInFlightRef.current = false;
    setRetryCount((count) => count + 1);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      setStatus("idle");
      setError(null);
      setBackendUser(null);
      setWorkspaces([]);
      resetWorkspaceStore();
      syncInFlightRef.current = false;
      return;
    }

    if (syncInFlightRef.current) {
      return;
    }

    let cancelled = false;
    syncInFlightRef.current = true;

    async function runSync() {
      setStatus("syncing");
      setError(null);

      try {
        const region = detectDeviceRegion();
        const timezone = detectDeviceTimezone();
        const user = await syncUser(() => getTokenRef.current(), { region, timezone });
        const nextWorkspaces = await listWorkspaces(() => getTokenRef.current());

        if (!cancelled) {
          setBackendUser(user);
          applyWorkspaces(nextWorkspaces.map(toCurrentWorkspace));
          setStatus("synced");
        }
      } catch (syncError) {
        if (cancelled) {
          return;
        }

        const message =
          syncError instanceof ApiError
            ? syncError.message
            : "Could not connect to the backend";

        if (__DEV__) {
          console.error("[BackendSync] sync failed:", syncError);
        }

        setError(message);
        setStatus("error");
        setBackendUser(null);
        setWorkspaces([]);
      } finally {
        if (!cancelled) {
          syncInFlightRef.current = false;
        }
      }
    }

    runSync();

    return () => {
      cancelled = true;
      syncInFlightRef.current = false;
    };
  }, [applyWorkspaces, isLoaded, isSignedIn, resetWorkspaceStore, retryCount]);

  const currentWorkspace = useMemo(() => {
    if (!currentWorkspaceId) {
      return null;
    }

    return (
      workspaces.find((workspace) => workspace.id === currentWorkspaceId) ?? null
    );
  }, [currentWorkspaceId, workspaces]);

  const value = useMemo(
    () => ({
      status,
      error,
      backendUser,
      workspaces,
      currentWorkspace,
      refreshWorkspaces,
      retry,
      isBootstrapping:
        !!isSignedIn && (status === "idle" || status === "syncing"),
    }),
    [
      status,
      error,
      backendUser,
      workspaces,
      currentWorkspace,
      refreshWorkspaces,
      retry,
      isSignedIn,
    ],
  );

  return (
    <BackendSyncContext.Provider value={value}>
      {children}
    </BackendSyncContext.Provider>
  );
}

export function useBackendSync(): BackendSyncContextValue {
  const context = useContext(BackendSyncContext);

  if (!context) {
    throw new Error("useBackendSync must be used within BackendSyncProvider");
  }

  return context;
}
