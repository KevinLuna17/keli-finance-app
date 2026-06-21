const AMOUNT_PATTERN = /^\d+([.,]\d{1,2})?$/;

export function parseAmountToCents(amount: string): number {
  const normalized = amount.trim().replace(",", ".");
  const value = Number(normalized);

  return Math.round(value * 100);
}

export function formatCentsToAmountInput(amountInCents: number): string {
  return (amountInCents / 100).toFixed(2);
}

export function isValidAmountInput(amount: string): boolean {
  const trimmed = amount.trim();

  if (!trimmed || !AMOUNT_PATTERN.test(trimmed)) {
    return false;
  }

  return parseAmountToCents(trimmed) > 0;
}
