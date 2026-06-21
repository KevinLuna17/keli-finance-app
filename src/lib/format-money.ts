const DEFAULT_CURRENCY = "USD";
const DEFAULT_LOCALE = "en-US";

export function formatMoney(
  amountInSmallestUnits: number,
  currency = DEFAULT_CURRENCY,
  locale = DEFAULT_LOCALE,
): string {
  const amount = amountInSmallestUnits / 100;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatSignedMoney(
  amountInSmallestUnits: number,
  type: "income" | "expense",
  currency = DEFAULT_CURRENCY,
  locale = DEFAULT_LOCALE,
): string {
  const formattedAmount = formatMoney(
    Math.abs(amountInSmallestUnits),
    currency,
    locale,
  );
  const prefix = type === "income" ? "+ " : "- ";

  return `${prefix}${formattedAmount}`;
}
