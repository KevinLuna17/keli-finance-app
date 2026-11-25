import { AuthFieldError } from "@/components/auth/AuthFieldError";
import ScreenLayout from "@/components/ui/ScreenLayout";
import { useDeleteAccount } from "@/hooks/use-delete-account";
import { FontAwesome6 } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

const DELETED_ITEMS = [
  "deleteAccount.itemProfile",
  "deleteAccount.itemTransactions",
  "deleteAccount.itemCategories",
  "deleteAccount.itemWorkspaces",
] as const;

export function DeleteAccountScreen() {
  const { t } = useTranslation();
  const { confirmDeletion, isDeleting, errorKey } = useDeleteAccount();

  const confirmDelete = () => {
    Alert.alert(
      t("deleteAccount.confirmTitle"),
      t("deleteAccount.confirmMessage"),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("deleteAccount.confirmAction"),
          style: "destructive",
          onPress: () => {
            void confirmDeletion();
          },
        },
      ],
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: t("deleteAccount.title") }} />
      <ScreenLayout edges={["bottom"]} background="modal" className="flex-1">
        <ScrollView
          className="flex-1 px-6"
          contentContainerClassName="pb-8 pt-6"
          showsVerticalScrollIndicator={false}
        >
          {errorKey ? (
            <View className="mb-4">
              <AuthFieldError message={t(errorKey)} />
            </View>
          ) : null}

          <View className="mb-6 size-14 items-center justify-center rounded-full bg-destructive/10">
            <FontAwesome6 name="triangle-exclamation" size={22} color="#DC2626" />
          </View>

          <Text className="text-xl font-bold text-card-foreground">
            {t("deleteAccount.heading")}
          </Text>
          <Text className="mt-2 text-base leading-6 text-muted-foreground">
            {t("deleteAccount.description")}
          </Text>

          <View className="mt-6 gap-3">
            {DELETED_ITEMS.map((itemKey) => (
              <View key={itemKey} className="flex-row items-start gap-3">
                <FontAwesome6
                  name="circle-xmark"
                  size={16}
                  color="#DC2626"
                  style={{ marginTop: 2 }}
                />
                <Text className="flex-1 text-base text-card-foreground">
                  {t(itemKey)}
                </Text>
              </View>
            ))}
          </View>

          <Text className="mt-6 text-sm leading-5 text-muted-foreground">
            {t("deleteAccount.irreversible")}
          </Text>
        </ScrollView>

        <View className="bg-card px-6 pb-6 pt-4">
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: isDeleting }}
            disabled={isDeleting}
            onPress={confirmDelete}
            className="items-center rounded-2xl bg-destructive py-4"
          >
            {isDeleting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-base font-semibold text-white">
                {t("deleteAccount.confirmAction")}
              </Text>
            )}
          </Pressable>
        </View>
      </ScreenLayout>
    </>
  );
}
