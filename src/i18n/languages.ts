import * as Localization from "expo-localization";

export const SUPPORTED_LANGUAGES = ["en", "es"] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export function detectDeviceLanguage(): SupportedLanguage {
  const locales = Localization.getLocales();
  const deviceLanguage = locales[0]?.languageCode ?? "en";

  return (SUPPORTED_LANGUAGES as readonly string[]).includes(deviceLanguage)
    ? (deviceLanguage as SupportedLanguage)
    : "en";
}
