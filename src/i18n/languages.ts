import { detectDeviceLanguage as detectRawDeviceLanguage } from "@/lib/region";

export const SUPPORTED_LANGUAGES = ["en", "es"] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export function detectDeviceLanguage(): SupportedLanguage {
  return detectRawDeviceLanguage() as SupportedLanguage;
}
