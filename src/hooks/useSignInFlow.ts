import { createAuthNavigateHandler } from "@/lib/auth-finalize";
import {
  getClerkErrorMessage,
  isFieldLevelClerkError,
} from "@/lib/clerk-errors";
import { useSignIn } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  useAuthFieldChange,
  useAuthFlowFocusReset,
} from "@/hooks/useAuthFlowReset";

export function useSignInFlow() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [formError, setFormError] = useState("");

  const clearLocalErrors = useCallback(() => {
    setFormError("");
    setSecondFactor(false);
  }, []);

  useAuthFlowFocusReset(signIn, clearLocalErrors);

  const hasFieldErrors = Boolean(
    errors.fields.identifier?.message || errors.fields.password?.message,
  );

  const setEmailWithErrorClear = useAuthFieldChange(
    setEmailAddress,
    signIn,
    hasFieldErrors,
    clearLocalErrors,
  );

  const setPasswordWithErrorClear = useAuthFieldChange(
    setPassword,
    signIn,
    hasFieldErrors,
    clearLocalErrors,
  );

  const navigateAfterAuth = useMemo(
    () => createAuthNavigateHandler(router),
    [router],
  );

  const handleSubmit = useCallback(async () => {
    setFormError("");

    const { error } = await signIn.password({
      emailAddress,
      password,
    });
    if (error) {
      if (!isFieldLevelClerkError(error)) {
        setFormError(getClerkErrorMessage(error));
      }
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({ navigate: navigateAfterAuth });
    } else if (signIn.status === "needs_second_factor") {
      setFormError(
        "Additional verification is required. Try another sign-in method.",
      );
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );

      if (emailCodeFactor) {
        const { error: sendError } = await signIn.mfa.sendEmailCode();
        if (sendError) {
          setFormError(getClerkErrorMessage(sendError));
          return;
        }
        setSecondFactor(true);
      }
    } else {
      setFormError(`Sign in incomplete: ${signIn.status}`);
    }
  }, [emailAddress, password, signIn, navigateAfterAuth]);

  const handleVerify = useCallback(
    async (code: string) => {
      const { error } = await signIn.mfa.verifyEmailCode({ code });
      if (error) {
        throw error;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({ navigate: navigateAfterAuth });
      }
    },
    [signIn, navigateAfterAuth],
  );

  const handleStartOver = useCallback(() => {
    signIn.reset();
    setSecondFactor(false);
    setFormError("");
  }, [signIn]);

  const resendMfaCode = useCallback(async () => {
    await signIn.mfa.sendEmailCode();
  }, [signIn]);

  return {
    emailAddress,
    password,
    showPassword,
    setShowPassword,
    secondFactor,
    formError,
    errors,
    fetchStatus,
    setEmailWithErrorClear,
    setPasswordWithErrorClear,
    handleSubmit,
    handleVerify,
    handleStartOver,
    resendMfaCode,
  };
}
