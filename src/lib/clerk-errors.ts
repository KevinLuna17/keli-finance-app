import i18n from "@/i18n";

type ClerkErrorShape = {
  errors?: { code?: string; message?: string; meta?: { paramName?: string } }[];
  code?: string;
  message?: string;
};

type ClerkFieldError = { code: string; message: string } | null | undefined;

/** Clerk error codes mapped to translation keys. Unknown codes use the generic message. */
const CLERK_ERROR_KEYS: Record<string, string> = {
  form_identifier_not_found: "auth.errors.accountNotFound",
  form_password_incorrect: "auth.errors.passwordIncorrect",
  form_password_pwned: "auth.errors.passwordPwned",
  form_password_length_too_short: "auth.errors.passwordTooShort",
  form_password_validation_failed: "auth.errors.passwordWeak",
  form_password_not_strong_enough: "auth.errors.passwordWeak",
  form_password_size_in_bytes_exceeded: "auth.errors.passwordTooLong",
  form_identifier_exists: "auth.errors.emailTaken",
  form_param_format_invalid: "auth.errors.emailInvalid",
  form_param_nil: "auth.errors.fieldRequired",
  form_param_missing: "auth.errors.fieldRequired",
  form_code_incorrect: "auth.errors.codeIncorrect",
  verification_failed: "auth.errors.codeIncorrect",
  verification_expired: "auth.errors.codeExpired",
  strategy_for_user_invalid: "auth.errors.useSocialSignIn",
  too_many_requests: "auth.errors.tooManyRequests",
  user_locked: "auth.errors.accountLocked",
};

const GENERIC_KEY = "auth.errors.generic";

function getClerkErrorCode(error: unknown): string | undefined {
  const clerkError = error as ClerkErrorShape | null | undefined;
  return clerkError?.errors?.[0]?.code ?? clerkError?.code;
}

function translateCode(code: string | undefined): string {
  return i18n.t((code && CLERK_ERROR_KEYS[code]) || GENERIC_KEY);
}

/**
 * Translated message for a Clerk error. Clerk messages are English only,
 * so they are never shown directly.
 */
export function getClerkErrorMessage(error: unknown): string {
  if (__DEV__) {
    console.warn("[Clerk] error:", error);
  }

  return translateCode(getClerkErrorCode(error));
}

/** Translated message for a Clerk field error (errors.fields.*). */
export function getClerkFieldErrorMessage(
  fieldError: ClerkFieldError,
): string | undefined {
  if (!fieldError) {
    return undefined;
  }

  return translateCode(fieldError.code);
}

/** True when the user closed the OAuth browser. Not an error to report. */
export function isClerkCancellation(error: unknown): boolean {
  const clerkError = error as ClerkErrorShape | null | undefined;
  const rawMessage = clerkError?.errors?.[0]?.message ?? clerkError?.message ?? "";
  return rawMessage.toLowerCase().includes("cancel");
}

/** Clerk already maps these to errors.fields — avoid duplicating in a banner. */
export function isFieldLevelClerkError(error: unknown): boolean {
  const clerkError = error as ClerkErrorShape;
  return Boolean(clerkError.errors?.[0]?.meta?.paramName);
}
