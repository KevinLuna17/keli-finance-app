import {
  ProfileGlassPressable,
} from "@/components/profile/profile-glass-card";
import ScreenLayout from "@/components/ui/ScreenLayout";
import { useLanguageSettings } from "@/hooks/use-language-settings";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/i18n/languages";
import { hapticSelection } from "@/lib/haptics";
import { FontAwesome6 } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: "languageEnglish",
  es: "languageSpanish",
};

export function LanguageSettingsScreen() {
  const { t } = useTranslation();
  const { language, isSaving, syncError, selectLanguage, dismissError } =
    useLanguageSettings();

  const handleSelect = async (lang: SupportedLanguage) => {
    hapticSelection();
    await selectLanguage(lang);
  };

  return (
    <>
      <Stack.Screen options={{ title: t("language") }} />
      <ScreenLayout background="modal" edges={["bottom"]} className="flex-1">
        <View className="flex-1 px-6 pt-6">
          <View className="gap-3">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isActive = lang === language;

              return (
                <ProfileGlassPressable
                  key={lang}
                  contentClassName="flex-row items-center px-4 py-4"
                  active={isActive}
                  onPress={() => void handleSelect(lang)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isActive }}
                  accessibilityLabel={t(LANGUAGE_LABELS[lang])}
                >
                  <View
                    className={`size-10 items-center justify-center rounded-full ${
                      isActive ? "bg-brand/20" : "bg-muted/80"
                    }`}
                  >
                    <FontAwesome6
                      name="language"
                      size={16}
                      color="#508A67"
                    />
                  </View>

                  <Text className="ml-3 flex-1 text-base font-semibold text-card-foreground">
                    {t(LANGUAGE_LABELS[lang])}
                  </Text>

                  {isSaving && lang === language ? (
                    <ActivityIndicator size="small" color="#508A67" />
                  ) : isActive ? (
                    <FontAwesome6
                      name="circle-check"
                      size={18}
                      color="#508A67"
                    />
                  ) : null}
                </ProfileGlassPressable>
              );
            })}
          </View>

          {syncError ? (
            <Pressable
              className="mt-4 rounded-2xl bg-destructive/10 px-4 py-3"
              onPress={dismissError}
              accessibilityRole="button"
              accessibilityLabel="Dismiss error"
            >
              <Text className="text-sm text-destructive">
                {t("languageSyncError")}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </ScreenLayout>
    </>
  );
}
