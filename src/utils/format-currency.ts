/**
 * Shared currency formatting utilities.
 *
 * Rules:
 * - Always uses Intl.NumberFormat — never concatenates symbols manually.
 * - Never hardcodes decimal separators, thousands separators, or fraction digits.
 * - Fraction digits follow the ISO 4217 standard for each currency (e.g. 2 for
 *   USD/EUR, 0 for JPY). Do not override unless a product requirement demands it.
 * - The currency symbol is always placed before the amount, using the narrow
 *   symbol form (e.g. "$" not "US$"), while number separators follow the locale.
 * - Every function that formats money for display must go through this module.
 */

/**
 * Static narrow symbol map for all supported currencies.
 * Intl.NumberFormat with narrowSymbol is unreliable on some Hermes builds
 * (e.g. USD in Spanish locale returns "US$" instead of "$"), so we use a
 * hardcoded map as the primary source and fall back to the ISO code.
 */
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  COP: "$",
  MXN: "$",
  PEN: "S/",
  CLP: "$",
  ARS: "$",
  UYU: "$U",
  BRL: "R$",
  CAD: "$",
  GBP: "£",
};

/**
 * Returns the display symbol for a currency.
 * e.g. "USD" → "$", "EUR" → "€", "BRL" → "R$", "PEN" → "S/"
 */
function getCurrencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency] ?? currency;
}

/**
 * Returns the standard number of fraction digits for a currency (ISO 4217).
 * e.g. "USD" → 2, "JPY" → 0, "COP" → 0 or 2 depending on context.
 */
function getCurrencyFractionDigits(currency: string): number {
  return (
    new Intl.NumberFormat("en", {
      style: "currency",
      currency,
    }).resolvedOptions().maximumFractionDigits ?? 2
  );
}

/**
 * Formats an amount already expressed in major currency units (e.g. 12.50 USD).
 * Symbol is always placed first. Number separators follow the locale.
 *
 * Example: formatCurrencyAmount(1250.50, "USD", "es") → "$1.250,50"
 *          formatCurrencyAmount(1250.50, "USD", "en") → "$1,250.50"
 */
export function formatCurrencyAmount(
  amount: number,
  currency: string,
  language: string,
): string {
  const symbol = getCurrencySymbol(currency);
  const digits = getCurrencyFractionDigits(currency);
  const numberStr = new Intl.NumberFormat(language, {
    style: "decimal",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Math.abs(amount));
  return amount < 0 ? `-${symbol}${numberStr}` : `${symbol}${numberStr}`;
}

/**
 * Formats an amount stored in its smallest currency unit (cents, centavos, etc.).
 * Divides by 100 before delegating to formatCurrencyAmount.
 *
 * Example: formatCurrency(125050, "USD", "en") → "$1,250.50"
 *          formatCurrency(125000000, "COP", "es") → "$1.250.000"
 */
export function formatCurrency(
  amountInSmallestUnits: number,
  currency: string,
  language: string,
): string {
  return formatCurrencyAmount(amountInSmallestUnits / 100, currency, language);
}

/**
 * Formats a signed transaction amount with a "+" or "−" prefix.
 * Uses the absolute value so the sign is always explicit and consistent.
 *
 * Example: formatSignedCurrency(125050, "income", "USD", "en") → "+ $1,250.50"
 *          formatSignedCurrency(50000, "expense", "EUR", "en") → "- €500.00"
 */
export function formatSignedCurrency(
  amountInSmallestUnits: number,
  type: "income" | "expense",
  currency: string,
  language: string,
): string {
  const formatted = formatCurrency(
    Math.abs(amountInSmallestUnits),
    currency,
    language,
  );
  return type === "income" ? `+ ${formatted}` : `- ${formatted}`;
}

/**
 * Returns a compact Y-axis label for chart tick values.
 * Receives amounts already in major units (output of centsToChartUnits).
 * Symbol is always placed first using compact notation (e.g. $1.2K, $2.5M).
 */
export function formatChartAxisCurrency(
  majorUnitAmount: number,
  currency: string,
  language: string,
): string {
  const symbol = getCurrencySymbol(currency);
  const abs = Math.abs(majorUnitAmount);
  const sign = majorUnitAmount < 0 ? "-" : "";

  if (abs >= 1_000_000) {
    const compact = new Intl.NumberFormat(language, {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(abs);
    return `${sign}${symbol}${compact}`;
  }

  if (abs >= 1_000) {
    const compact = new Intl.NumberFormat(language, {
      notation: "compact",
      maximumFractionDigits: abs >= 10_000 ? 0 : 1,
    }).format(abs);
    return `${sign}${symbol}${compact}`;
  }

  const numberStr = new Intl.NumberFormat(language, {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(abs);
  return `${sign}${symbol}${numberStr}`;
}

/**
 * Factory that returns a plain (value: number) => string callback
 * bound to a specific currency and language.
 * Use when a chart library requires a callback with that exact signature.
 */
export function makeChartCurrencyFormatter(
  currency: string,
  language: string,
): (value: number) => string {
  return (value: number) => formatChartAxisCurrency(value, currency, language);
}
