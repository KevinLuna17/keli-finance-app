import i18n from "@/i18n";
import {
  detectDeviceLanguage,
  type SupportedLanguage,
} from "@/i18n/languages";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

const secureStorage: StateStorage = {
  getItem: (name) => SecureStore.getItemAsync(name),
  setItem: (name, value) => SecureStore.setItemAsync(name, value),
  removeItem: (name) => SecureStore.deleteItemAsync(name),
};

type PreferencesStore = {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
};

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      language: detectDeviceLanguage(),
      setLanguage: (language) => {
        set({ language });
        i18n.changeLanguage(language);
      },
    }),
    {
      name: "keli-preferences-store",
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({ language: state.language }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          i18n.changeLanguage(state.language);
        }
      },
    },
  ),
);
