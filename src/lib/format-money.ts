/**
 * @deprecated
 * Use `useFormatCurrency` from `@/hooks/use-format-currency` instead.
 * These wrappers exist only for backward-compatibility during migration.
 * New code must never import from this file directly.
 */
import {
  formatCurrency,
  formatSignedCurrency,
} from "@/utils/format-currency";

const DEFAULT_CURRENCY = "USD";
const DEFAULT_LANGUAGE = "en";

export function formatMoney(
  amountInSmallestUnits: number,
  currency: string = DEFAULT_CURRENCY,
  language: string = DEFAULT_LANGUAGE,
): string {
  return formatCurrency(amountInSmallestUnits, currency, language);
}

export function formatSignedMoney(
  amountInSmallestUnits: number,
  type: "income" | "expense",
  currency: string = DEFAULT_CURRENCY,
  language: string = DEFAULT_LANGUAGE,
): string {
  return formatSignedCurrency(amountInSmallestUnits, type, currency, language);
}
