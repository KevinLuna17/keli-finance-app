import React from "react";
import { Text, View } from "react-native";

type TransactionDateHeaderProps = {
  label: string;
};

export function TransactionDateHeader({ label }: TransactionDateHeaderProps) {
  return (
    <View className="pb-2 pt-4">
      <Text className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </Text>
    </View>
  );
}
