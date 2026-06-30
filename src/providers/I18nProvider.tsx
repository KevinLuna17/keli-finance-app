import i18n from "@/i18n";
import { usePreferencesStore } from "@/stores/preferences-store";
import React from "react";
import { I18nextProvider } from "react-i18next";

const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  // Accessing the store here ensures it is instantiated (and rehydration
  // begins) as early as possible, before any screen renders.
  usePreferencesStore();

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default I18nProvider;
