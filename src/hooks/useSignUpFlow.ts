import { createAuthNavigateHandler } from "@/lib/auth-finalize";
import {
  getClerkErrorMessage,
  isFieldLevelClerkError,
} from "@/lib/clerk-errors";
import {
  useAuthFieldChange,
  useAuthFlowFocusReset,
} from "@/hooks/useAuthFlowReset";
import { useAuth, useSignUp } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";

export function useSignUpFlow() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  const clearLocalErrors = useCallback(() => {
    setFormError("");
  }, []);

  useAuthFlowFocusReset(signUp, clearLocalErrors);

  const hasFieldErrors = Boolean(
    errors.fields.emailAddress?.message || errors.fields.password?.message,
  );

  const setEmailWithErrorClear = useAuthFieldChange(
    setEmailAddress,
    signUp,
    hasFieldErrors,
    clearLocalErrors,
  );

  const setPasswordWithErrorClear = useAuthFieldChange(
    setPassword,
    signUp,
    hasFieldErrors,
    clearLocalErrors,
  );

  const navigateAfterAuth = useMemo(
    () => createAuthNavigateHandler(router),
    [router],
  );

  const showEmailVerification = useMemo(
    () =>
      signUp.status === "missing_requirements" &&
      signUp.unverifiedFields.includes("email_address") &&
      signUp.missingFields.length === 0,
    [signUp.status, signUp.unverifiedFields, signUp.missingFields],
  );

  const handleSubmit = useCallback(async () => {
    setFormError("");

    const { error } = await signUp.password({
      emailAddress,
      password,
    });
    if (error) {
      if (!isFieldLevelClerkError(error)) {
        setFormError(getClerkErrorMessage(error));
      }
      return;
    }

    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) {
      setFormError(getClerkErrorMessage(sendError));
    }
  }, [emailAddress, password, signUp]);

  const handleVerify = useCallback(
    async (code: string) => {
      const { error } = await signUp.verifications.verifyEmailCode({ code });
      if (error) {
        throw error;
      }

      if (signUp.status === "complete") {
        await signUp.finalize({ navigate: navigateAfterAuth });
      }
    },
    [signUp, navigateAfterAuth],
  );

  const handleStartOver = useCallback(() => {
    signUp.reset();
    setFormError("");
  }, [signUp]);

  const resendEmailCode = useCallback(async () => {
    await signUp.verifications.sendEmailCode();
  }, [signUp]);

  return {
    emailAddress,
    password,
    showPassword,
    setShowPassword,
    formError,
    errors,
    fetchStatus,
    isLoaded,
    isSignedIn,
    showEmailVerification,
    setEmailWithErrorClear,
    setPasswordWithErrorClear,
    handleSubmit,
    handleVerify,
    handleStartOver,
    resendEmailCode,
  };
}
