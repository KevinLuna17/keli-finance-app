import { DEFAULT_CURRENCY } from "@/lib/currencies";

export function centsToChartUnits(amountInCents: number): number {
  return amountInCents / 100;
}

/**
 * Returns a compact axis label for chart Y-axis tick values.
 * Values arrive as major units (already divided by 100 via centsToChartUnits).
 */
export function formatChartAxisMoney(
  value: number,
  currency: string = DEFAULT_CURRENCY,
): string {
  const absoluteValue = Math.abs(value);

  if (absoluteValue >= 1_000_000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }

  if (absoluteValue >= 1_000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: absoluteValue >= 10_000 ? 0 : 1,
    }).format(value);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Creates a chart axis money formatter bound to a specific currency.
 * Use this when you need to pass a plain (value: number) => string callback.
 */
export function makeChartAxisMoneyFormatter(
  currency: string = DEFAULT_CURRENCY,
): (value: number) => string {
  return (value: number) => formatChartAxisMoney(value, currency);
}
