import { getApiErrorMessage } from "@/lib/api/api-error-message";
import { getProfile } from "@/services/profile/profile.service";
import type { Profile } from "@/services/profile/profile.types";
import { useAuth } from "@clerk/expo";
import { useCallback, useEffect, useRef, useState } from "react";

type UseProfileResult = {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useProfile(): UseProfileResult {
  const { getToken } = useAuth();
  const getTokenRef = useRef(getToken);
  useEffect(() => {
    getTokenRef.current = getToken;
  });

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getProfile(() => getTokenRef.current());
      setProfile(data);
    } catch (loadError) {
      setError(
        getApiErrorMessage(loadError, "errors.loadProfile"),
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
    profile,
    isLoading,
    error,
    refresh,
  };
}
