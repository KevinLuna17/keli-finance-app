/**
 * @deprecated
 * Use `useFormatCurrency` from `@/hooks/use-format-currency` (chartFormatter)
 * or `makeChartCurrencyFormatter` from `@/utils/format-currency` instead.
 * These wrappers exist only for backward-compatibility during migration.
 */
import { DEFAULT_CURRENCY } from "@/lib/currencies";
import {
  formatChartAxisCurrency,
  makeChartCurrencyFormatter,
} from "@/utils/format-currency";

const DEFAULT_LANGUAGE = "en";

export function centsToChartUnits(amountInCents: number): number {
  return amountInCents / 100;
}

export function formatChartAxisMoney(
  value: number,
  currency: string = DEFAULT_CURRENCY,
  language: string = DEFAULT_LANGUAGE,
): string {
  return formatChartAxisCurrency(value, currency, language);
}

export function makeChartAxisMoneyFormatter(
  currency: string = DEFAULT_CURRENCY,
  language: string = DEFAULT_LANGUAGE,
): (value: number) => string {
  return makeChartCurrencyFormatter(currency, language);
}
