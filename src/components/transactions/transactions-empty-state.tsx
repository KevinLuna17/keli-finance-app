import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

type TransactionsEmptyStateProps = {
  onAddPress?: () => void;
};

export function TransactionsEmptyState({
  onAddPress,
}: TransactionsEmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-6 py-16">
      <View className="size-16 items-center justify-center rounded-full bg-muted">
        <FontAwesome6 name="receipt" size={28} color="#508A67" />
      </View>
      <Text className="mt-4 text-center text-lg font-bold text-foreground">
        No transactions yet
      </Text>
      <Text className="mt-2 text-center text-base leading-6 text-muted-foreground">
        Add your first income or expense to start tracking your finances.
      </Text>
      {onAddPress ? (
        <Pressable
          className="mt-8 rounded-2xl bg-brand px-6 py-3"
          onPress={onAddPress}
          accessibilityRole="button"
          accessibilityLabel="Add transaction"
        >
          <Text className="text-base font-semibold text-brand-foreground">
            Add Transaction
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
