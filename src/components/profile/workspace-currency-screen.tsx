import { ProfileGlassPressable } from "@/components/profile/profile-glass-card";
import ScreenLayout from "@/components/ui/ScreenLayout";
import { useWorkspaceCurrency } from "@/hooks/use-workspace-currency";
import {
  getCurrencyDisplayName,
  SUPPORTED_CURRENCIES,
} from "@/lib/currencies";
import { hapticSelection } from "@/lib/haptics";
import { FontAwesome6 } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

export function WorkspaceCurrencyScreen() {
  const { t, i18n } = useTranslation();
  const { id: workspaceId } = useLocalSearchParams<{ id: string }>();

  const { currentCurrency, isSaving, error, selectCurrency, dismissError } =
    useWorkspaceCurrency(workspaceId);

  const handleSelect = async (currency: string) => {
    hapticSelection();
    await selectCurrency(currency);
  };

  return (
    <>
      <Stack.Screen options={{ title: t("workspaces.currencyModalTitle") }} />
      <ScreenLayout background="modal" edges={["bottom"]} className="flex-1">
        <View className="flex-1 px-6 pt-6">
          <Text className="mb-4 text-sm text-muted-foreground">
            {t("workspaces.currencyHint")}
          </Text>

          <View className="gap-3">
            {SUPPORTED_CURRENCIES.map((currency) => {
              const isActive = currency === currentCurrency;
              const displayName = getCurrencyDisplayName(
                currency,
                i18n.language,
              );

              return (
                <ProfileGlassPressable
                  key={currency}
                  contentClassName="flex-row items-center px-4 py-4"
                  active={isActive}
                  onPress={() => void handleSelect(currency)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isActive }}
                  accessibilityLabel={`${currency} — ${displayName}`}
                >
                  <View
                    className={`size-10 items-center justify-center rounded-full ${
                      isActive ? "bg-brand/20" : "bg-muted/80"
                    }`}
                  >
                    <FontAwesome6
                      name="coins"
                      size={14}
                      color="#508A67"
                    />
                  </View>

                  <View className="ml-3 flex-1">
                    <Text className="text-base font-semibold text-card-foreground">
                      {currency}
                    </Text>
                    <Text className="mt-0.5 text-sm text-muted-foreground">
                      {displayName}
                    </Text>
                  </View>

                  {isSaving && isActive ? (
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

          {error ? (
            <Pressable
              className="mt-4 rounded-2xl bg-destructive/10 px-4 py-3"
              onPress={dismissError}
              accessibilityRole="button"
              accessibilityLabel={t("workspaces.dismissCurrencyError")}
            >
              <Text className="text-sm text-destructive">{error}</Text>
            </Pressable>
          ) : null}
        </View>
      </ScreenLayout>
    </>
  );
}
