import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useRef } from "react";

type AuthFlow = {
  reset: () => void;
};

/**
 * Resets the Clerk flow when leaving the screen (blur), so stale errors
 * are gone when the user navigates back. Avoids reset-on-focus loops.
 */
export function useAuthFlowFocusReset(
  flow: AuthFlow,
  clearLocalState?: () => void,
) {
  const flowRef = useRef(flow);
  const clearRef = useRef(clearLocalState);
  flowRef.current = flow;
  clearRef.current = clearLocalState;

  useFocusEffect(
    useCallback(() => {
      return () => {
        flowRef.current.reset();
        clearRef.current?.();
      };
    }, []),
  );
}

/** Clears Clerk field errors once the user edits after a failed submit. */
export function useAuthFieldChange(
  setValue: (value: string) => void,
  flow: AuthFlow,
  hasFieldErrors: boolean,
  clearLocalState?: () => void,
) {
  const flowRef = useRef(flow);
  const clearRef = useRef(clearLocalState);
  flowRef.current = flow;
  clearRef.current = clearLocalState;

  return useCallback(
    (value: string) => {
      setValue(value);

      if (hasFieldErrors) {
        flowRef.current.reset();
        clearRef.current?.();
      }
    },
    [setValue, hasFieldErrors],
  );
}
