import { PendingInvitationsSection } from "@/components/profile/pending-invitations-section";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import {
  ProfileGlassCard,
  ProfileGlassPressable,
} from "@/components/profile/profile-glass-card";
import { WorkspacesSection } from "@/components/profile/workspaces-section";
import { TransactionsErrorState } from "@/components/transactions/transactions-error-state";
import ScreenLayout from "@/components/ui/ScreenLayout";
import { useInvitations } from "@/hooks/use-invitations";
import { useProfile } from "@/hooks/use-profile";
import { useBackendSync } from "@/hooks/useBackendSync";
import { usePreferencesStore } from "@/stores/preferences-store";
import { type SupportedLanguage } from "@/i18n/languages";
import { useClerk } from "@clerk/expo";
import { FontAwesome6 } from "@expo/vector-icons";
import { Href, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useRef } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: "languageEnglish",
  es: "languageSpanish",
};

/** Space for native tab bar above the home indicator. */
const TAB_BAR_HEIGHT = 56;

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signOut } = useClerk();
  const { t } = useTranslation();
  const isFirstFocus = useRef(true);
  const { profile, isLoading, error, refresh } = useProfile();
  const { refreshWorkspaces } = useBackendSync();
  const invitationsState = useInvitations();
  const { language } = usePreferencesStore();

  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }

      refresh();
      void refreshWorkspaces();
      void invitationsState.refresh();
    }, [refresh, refreshWorkspaces, invitationsState.refresh]),
  );

  if (isLoading && !profile) {
    return (
      <ScreenLayout
        edges={["top"]}
        background="custom"
        className="items-center justify-center"
      >
        <ActivityIndicator size="large" color="hsl(144, 16%, 37%)" />
      </ScreenLayout>
    );
  }

  if (error && !profile) {
    return (
      <ScreenLayout edges={["top"]} background="custom" className="flex-1">
        <TransactionsErrorState message={error} onRetry={refresh} />
      </ScreenLayout>
    );
  }

  if (!profile) {
    return null;
  }

  const displayName = profile.name?.trim() || t("profileScreen.user");

  return (
    <ScreenLayout edges={["top"]} background="custom" className="flex-1">
      <ScrollView
        className="flex-1 px-6"
        contentContainerClassName="pt-6"
        contentContainerStyle={{
          paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 24,
        }}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-bold text-foreground mb-4">{t("profile")}</Text>

        <ProfileGlassCard contentClassName="items-center p-6" className="mt-8">
          <ProfileAvatar profile={profile} size={96} />

          <Text className="mt-4 text-xl font-bold text-card-foreground">
            {displayName}
          </Text>
          <Text className="mt-1 text-sm text-muted-foreground">
            {profile.email}
          </Text>

          <Pressable
            className="mt-6 w-full items-center rounded-2xl bg-brand py-3"
            onPress={() => router.push("/profile/edit" as Href)}
            accessibilityRole="button"
            accessibilityLabel={t("profileScreen.editProfileLabel")}
          >
            <Text className="text-base font-semibold text-brand-foreground">
              {t("profileScreen.editProfile")}
            </Text>
          </Pressable>
        </ProfileGlassCard>

        <View className="mt-8">
          <Text className="text-lg font-bold text-foreground">
            {t("settings")}
          </Text>

          <View className="mt-4">
            <ProfileGlassPressable
              contentClassName="flex-row items-center px-4 py-4"
              onPress={() => router.push("/profile/language" as Href)}
              accessibilityRole="button"
              accessibilityLabel={t("language")}
            >
              <View className="size-10 items-center justify-center rounded-full bg-muted/80">
                <FontAwesome6 name="language" size={16} color="#508A67" />
              </View>

              <Text className="ml-3 flex-1 text-base font-semibold text-card-foreground">
                {t("language")}
              </Text>

              <Text className="mr-2 text-sm text-muted-foreground">
                {t(LANGUAGE_LABELS[language])}
              </Text>

              <FontAwesome6
                name="chevron-right"
                size={12}
                color="#64748B"
              />
            </ProfileGlassPressable>
          </View>
        </View>

        <WorkspacesSection
          onWorkspaceChanged={() => {
            void refreshWorkspaces();
          }}
        />
        <PendingInvitationsSection
          {...invitationsState}
          onInvitationResolved={refreshWorkspaces}
        />

        <ProfileGlassPressable
          className="mt-6"
          contentClassName="h-14 items-center justify-center"
          onPress={() => signOut()}
          accessibilityRole="button"
          accessibilityLabel={t("signOut")}
        >
          <Text className="text-base font-bold text-destructive">{t("signOut")}</Text>
        </ProfileGlassPressable>
      </ScrollView>
    </ScreenLayout>
  );
}
