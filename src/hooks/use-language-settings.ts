import { ApiError } from "@/lib/api/client";
import { updatePreferences } from "@/services/preferences/preferences.service";
import { usePreferencesStore } from "@/stores/preferences-store";
import { type SupportedLanguage } from "@/i18n/languages";
import { useAuth } from "@clerk/expo";
import { useCallback, useState } from "react";

type UseLanguageSettingsResult = {
  language: SupportedLanguage;
  isSaving: boolean;
  syncError: string | null;
  selectLanguage: (lang: SupportedLanguage) => Promise<void>;
  dismissError: () => void;
};

export function useLanguageSettings(): UseLanguageSettingsResult {
  const { getToken } = useAuth();
  const { language, setLanguage } = usePreferencesStore();
  const [isSaving, setIsSaving] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const selectLanguage = useCallback(
    async (lang: SupportedLanguage) => {
      if (lang === language) {
        return;
      }

      setSyncError(null);
      setLanguage(lang);

      setIsSaving(true);
      try {
        await updatePreferences(() => getToken(), { language: lang });
      } catch (err) {
        setSyncError(
          err instanceof ApiError
            ? err.message
            : "Could not sync language preference",
        );
      } finally {
        setIsSaving(false);
      }
    },
    [language, setLanguage, getToken],
  );

  const dismissError = useCallback(() => setSyncError(null), []);

  return { language, isSaving, syncError, selectLanguage, dismissError };
}
