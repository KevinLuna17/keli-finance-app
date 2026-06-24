export function centsToChartUnits(amountInCents: number): number {
  return amountInCents / 100;
}

export function formatChartAxisMoney(value: number): string {
  const absoluteValue = Math.abs(value);

  if (absoluteValue >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }

  if (absoluteValue >= 1_000) {
    return `$${(value / 1_000).toFixed(absoluteValue >= 10_000 ? 0 : 1)}k`;
  }

  return `$${Math.round(value)}`;
}
