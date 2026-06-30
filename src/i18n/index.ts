import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en/common.json";
import es from "../locales/es/common.json";

const SUPPORTED_LANGUAGES = ["en", "es"] as const;

type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

function detectLanguage(): SupportedLanguage {
  const locales = Localization.getLocales();
  const deviceLanguage = locales[0]?.languageCode ?? "en";

  return (SUPPORTED_LANGUAGES as readonly string[]).includes(deviceLanguage)
    ? (deviceLanguage as SupportedLanguage)
    : "en";
}

i18n.use(initReactI18next).init({
  resources: {
    en: { common: en },
    es: { common: es },
  },
  lng: detectLanguage(),
  fallbackLng: "en",
  ns: ["common"],
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
