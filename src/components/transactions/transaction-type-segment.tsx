import { TransactionType } from "@/services/transactions/transaction.types";
import { hapticTabPress } from "@/lib/haptics";
import React from "react";
import { Pressable, Text, View } from "react-native";

type TransactionTypeSegmentProps = {
  value: TransactionType;
  onChange: (value: TransactionType) => void;
  disabled?: boolean;
};

const OPTIONS: { value: TransactionType; label: string }[] = [
  { value: "expense", label: "Expense" },
  { value: "income", label: "Income" },
];

export function TransactionTypeSegment({
  value,
  onChange,
  disabled = false,
}: TransactionTypeSegmentProps) {
  return (
    <View className="flex-row rounded-2xl border border-border bg-card p-1">
      {OPTIONS.map((option) => {
        const selected = value === option.value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected, disabled }}
            disabled={disabled}
            onPress={() => {
              hapticTabPress();
              onChange(option.value);
            }}
            className={`flex-1 items-center rounded-xl py-3 ${
              selected ? "bg-brand" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                selected ? "text-brand-foreground" : "text-muted-foreground"
              }`}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
