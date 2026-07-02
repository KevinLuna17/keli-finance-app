import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

type TransactionsEmptyStateProps = {
  onAddPress?: () => void;
};

export function TransactionsEmptyState({
  onAddPress,
}: TransactionsEmptyStateProps) {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center px-6 py-16">
      <View className="size-16 items-center justify-center rounded-full bg-muted">
        <FontAwesome6 name="receipt" size={28} color="#508A67" />
      </View>
      <Text className="mt-4 text-center text-lg font-bold text-foreground">
        {t("transactionsList.emptyTitle")}
      </Text>
      <Text className="mt-2 text-center text-base leading-6 text-muted-foreground">
        {t("transactionsList.emptySubtitle")}
      </Text>
      {onAddPress ? (
        <Pressable
          className="mt-8 rounded-2xl bg-brand px-6 py-3"
          onPress={onAddPress}
          accessibilityRole="button"
          accessibilityLabel={t("transactionsList.addTransaction")}
        >
          <Text className="text-base font-semibold text-brand-foreground">
            {t("transactionsList.addFirstTransaction")}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
