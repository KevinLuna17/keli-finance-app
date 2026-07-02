/**
 * Shared currency formatting utilities.
 *
 * Rules:
 * - Always uses Intl.NumberFormat — never concatenates symbols manually.
 * - Never hardcodes decimal separators, thousands separators, or fraction digits.
 * - Fraction digits follow the ISO 4217 standard for each currency (e.g. 2 for
 *   USD/EUR, 0 for JPY). Do not override unless a product requirement demands it.
 * - Every function that formats money for display must go through this module.
 */

/**
 * Formats an amount already expressed in major currency units (e.g. 12.50 USD).
 * Use this when the value has already been divided out of its smallest-unit form.
 */
export function formatCurrencyAmount(
  amount: number,
  currency: string,
  language: string,
): string {
  return new Intl.NumberFormat(language, {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Formats an amount stored in its smallest currency unit (cents, centavos, etc.).
 * Divides by 100 before delegating to formatCurrencyAmount.
 *
 * Example: formatCurrency(125050, "USD", "en") → "$1,250.50"
 *          formatCurrency(125000000, "COP", "es") → "$ 1.250.000"
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
 * Uses compact notation to keep axis labels short (e.g. $1.2k, $2.5M).
 */
export function formatChartAxisCurrency(
  majorUnitAmount: number,
  currency: string,
  language: string,
): string {
  const absoluteValue = Math.abs(majorUnitAmount);

  if (absoluteValue >= 1_000_000) {
    return new Intl.NumberFormat(language, {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(majorUnitAmount);
  }

  if (absoluteValue >= 1_000) {
    return new Intl.NumberFormat(language, {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: absoluteValue >= 10_000 ? 0 : 1,
    }).format(majorUnitAmount);
  }

  return new Intl.NumberFormat(language, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(majorUnitAmount);
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
