import { useCurrency } from "@/hooks/use-currency";
import {
  formatCurrency,
  formatCurrencyAmount,
  formatSignedCurrency,
  makeChartCurrencyFormatter,
} from "@/utils/format-currency";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

type UseFormatCurrencyResult = {
  /** Formats an amount stored in smallest units (cents, centavos, etc.). */
  format: (amountInSmallestUnits: number) => string;
  /** Formats a signed transaction amount with a + or - prefix. */
  formatSigned: (amountInSmallestUnits: number, type: "income" | "expense") => string;
  /** Formats an amount already in major units (dollars, pesos, etc.). */
  formatAmount: (majorUnitAmount: number) => string;
  /** Pre-bound compact formatter for chart Y-axis labels. */
  chartFormatter: (value: number) => string;
};

/**
 * Returns currency formatting functions bound to the current workspace
 * currency and active application language.
 *
 * All components that display monetary values must use this hook instead
 * of calling formatCurrency directly, so that workspace currency and
 * language changes propagate automatically.
 */
export function useFormatCurrency(): UseFormatCurrencyResult {
  const currency = useCurrency();
  const { i18n } = useTranslation();
  const language = i18n.language;

  const format = useCallback(
    (amountInSmallestUnits: number) =>
      formatCurrency(amountInSmallestUnits, currency, language),
    [currency, language],
  );

  const formatSigned = useCallback(
    (amountInSmallestUnits: number, type: "income" | "expense") =>
      formatSignedCurrency(amountInSmallestUnits, type, currency, language),
    [currency, language],
  );

  const formatAmount = useCallback(
    (majorUnitAmount: number) =>
      formatCurrencyAmount(majorUnitAmount, currency, language),
    [currency, language],
  );

  const chartFormatter = useMemo(
    () => makeChartCurrencyFormatter(currency, language),
    [currency, language],
  );

  return { format, formatSigned, formatAmount, chartFormatter };
}
