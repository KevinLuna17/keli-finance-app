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
