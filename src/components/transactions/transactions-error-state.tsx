import React from "react";
import { Pressable, Text, View } from "react-native";

type TransactionsErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export function TransactionsErrorState({
  message,
  onRetry,
}: TransactionsErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-6 py-16">
      <Text className="text-center text-lg font-bold text-foreground">
        Could not load transactions
      </Text>
      <Text className="mt-3 text-center text-base leading-6 text-muted-foreground">
        {message}
      </Text>
      <Pressable
        className="mt-8 h-14 w-full max-w-xs items-center justify-center rounded-2xl bg-brand active:opacity-90"
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Retry loading transactions"
      >
        <Text className="text-base font-bold text-brand-foreground">
          Try again
        </Text>
      </Pressable>
    </View>
  );
}
