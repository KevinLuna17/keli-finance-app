import { TransactionListItem } from "@/components/transactions/transaction-list-item";
import type { CategoryLookup } from "@/lib/category-display";
import { Transaction } from "@/services/transactions/transaction.types";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

type RecentActivitySectionProps = {
  title: string;
  viewAllLabel: string;
  transactions: Transaction[];
  categoryLookup?: CategoryLookup;
  onViewAllPress?: () => void;
};

export default function RecentActivitySection({
  title,
  viewAllLabel,
  transactions,
  categoryLookup = {},
  onViewAllPress,
}: RecentActivitySectionProps) {
  const { t } = useTranslation();

  return (
    <View className="mt-8">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-lg font-bold text-foreground">{title}</Text>
        {onViewAllPress ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={viewAllLabel}
            onPress={onViewAllPress}
            hitSlop={8}
          >
            <Text className="text-sm font-semibold text-brand">
              {viewAllLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>

      {transactions.length === 0 ? (
        <View className="rounded-2xl bg-card p-6">
          <Text className="text-center text-sm text-muted-foreground">
            {t("dashboard.noRecentTransactions")}
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {transactions.map((transaction) => (
            <TransactionListItem
              key={transaction.id}
              transaction={transaction}
              categoryLookup={categoryLookup}
            />
          ))}
        </View>
      )}
    </View>
  );
}
