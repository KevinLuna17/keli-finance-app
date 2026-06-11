import { syncUser } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import type { BackendUser } from "@/types/api";
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
  retry: () => void;
  isBootstrapping: boolean;
};

const BackendSyncContext = createContext<BackendSyncContextValue | null>(null);

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
  const [retryCount, setRetryCount] = useState(0);

  getTokenRef.current = getToken;

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
        const user = await syncUser(() => getTokenRef.current());

        if (!cancelled) {
          setBackendUser(user);
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
  }, [isLoaded, isSignedIn, retryCount]);

  const value = useMemo(
    () => ({
      status,
      error,
      backendUser,
      retry,
      isBootstrapping:
        !!isSignedIn && (status === "idle" || status === "syncing"),
    }),
    [status, error, backendUser, retry, isSignedIn],
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
