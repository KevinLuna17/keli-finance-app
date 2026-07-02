export const SUPPORTED_CURRENCIES = [
  "USD",
  "EUR",
  "COP",
  "MXN",
  "PEN",
  "CLP",
  "ARS",
  "UYU",
  "BRL",
  "CAD",
  "GBP",
] as const;

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export const DEFAULT_CURRENCY: SupportedCurrency = "USD";

/**
 * Returns the localized display name for a currency code using Intl.DisplayNames.
 * Falls back to the currency code itself when the environment does not support it.
 *
 * Example: getCurrencyDisplayName("COP", "es") → "peso colombiano"
 *          getCurrencyDisplayName("USD", "en") → "US Dollar"
 */
export function getCurrencyDisplayName(
  currency: string,
  language: string,
): string {
  try {
    const displayNames = new Intl.DisplayNames([language], { type: "currency" });
    return displayNames.of(currency) ?? currency;
  } catch {
    return currency;
  }
}
