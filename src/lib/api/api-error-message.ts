import i18n from "@/i18n";
import { ApiError } from "@/lib/api/client";

/** Backend error codes with their own message. Everything else uses the fallback. */
const API_ERROR_KEYS: Record<string, string> = {
  NO_TOKEN: "errors.sessionExpired",
  UNAUTHORIZED: "errors.sessionExpired",
  WORKSPACE_CURRENCY_LOCKED: "workspaces.errors.currencyLocked",
};

/**
 * Returns the translation key for an API error. Raw backend messages are
 * never shown to the user: they are English and may contain technical details.
 */
export function getApiErrorKey(error: unknown, fallbackKey: string): string {
  if (error instanceof ApiError) {
    return API_ERROR_KEYS[error.code] ?? fallbackKey;
  }

  // fetch rejects with a TypeError when there is no connection.
  if (error instanceof TypeError) {
    return "errors.network";
  }

  return fallbackKey;
}

/** Translated message for an API error, in the current language. */
export function getApiErrorMessage(error: unknown, fallbackKey: string): string {
  return i18n.t(getApiErrorKey(error, fallbackKey));
}
