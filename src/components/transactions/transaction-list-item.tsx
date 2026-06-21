import { getCategoryDisplay } from "@/lib/category-display";
import { formatSignedMoney } from "@/lib/format-money";
import { formatTransactionRowDate } from "@/lib/transaction-list-utils";
import { Transaction } from "@/services/transactions/transaction.types";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type TransactionListItemProps = {
  transaction: Transaction;
};

function TransactionListItemComponent({ transaction }: TransactionListItemProps) {
  const category = getCategoryDisplay(transaction.categoryId);
  const isIncome = transaction.type === "income";

  return (
    <View className="flex-row items-center rounded-2xl bg-card p-4 shadow-sm">
      <View
        className={`size-11 items-center justify-center rounded-xl ${category.iconBackgroundClassName}`}
      >
        <FontAwesome6 name={category.icon} size={18} color={category.iconColor} />
      </View>

      <View className="ml-3 flex-1">
        <Text
          className="text-base font-semibold text-card-foreground"
          numberOfLines={1}
        >
          {transaction.description}
        </Text>
        <Text className="mt-0.5 text-sm text-muted-foreground" numberOfLines={1}>
          {category.name}
        </Text>
        <Text className="mt-1 text-xs text-muted-foreground">
          {formatTransactionRowDate(transaction.transactionDate)}
        </Text>
      </View>

      <Text
        className={`ml-3 text-base font-bold ${
          isIncome ? "text-success" : "text-card-foreground"
        }`}
      >
        {formatSignedMoney(transaction.amountInCents, transaction.type)}
      </Text>
    </View>
  );
}

export const TransactionListItem = React.memo(TransactionListItemComponent);
