import { TransactionDateHeader } from "@/components/transactions/transaction-date-header";
import { TransactionListItem } from "@/components/transactions/transaction-list-item";
import { TransactionsEmptyState } from "@/components/transactions/transactions-empty-state";
import { TransactionsErrorState } from "@/components/transactions/transactions-error-state";
import type { CategoryLookup } from "@/lib/category-display";
import { TransactionListRow } from "@/lib/transaction-list-utils";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

type TransactionsListProps = {
  rows: TransactionListRow[];
  categoryLookup?: CategoryLookup;
  isInitialLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  isEmpty: boolean;
  hasError: boolean;
  errorMessage: string | null;
  onRefresh: () => void;
  onLoadMore: () => void;
  onRetry: () => void;
  onAddPress?: () => void;
};

export function TransactionsList({
  rows,
  categoryLookup = {},
  isInitialLoading,
  isRefreshing,
  isLoadingMore,
  isEmpty,
  hasError,
  errorMessage,
  onRefresh,
  onLoadMore,
  onRetry,
  onAddPress,
}: TransactionsListProps) {
  const { t } = useTranslation();

  const renderItem = useCallback(({ item }: { item: TransactionListRow }) => {
    if (item.type === "header") {
      return <TransactionDateHeader label={item.label} />;
    }

    return (
      <TransactionListItem
        transaction={item.transaction}
        categoryLookup={categoryLookup}
      />
    );
  }, [categoryLookup]);

  const keyExtractor = useCallback((item: TransactionListRow) => item.key, []);

  if (isInitialLoading) {
    return (
      <View className="flex-1 items-center justify-center py-16">
        <ActivityIndicator size="large" color="hsl(144, 16%, 37%)" />
      </View>
    );
  }

  if (hasError && rows.length === 0) {
    return (
      <TransactionsErrorState
        message={errorMessage ?? t("transactionsList.somethingWentWrong")}
        onRetry={onRetry}
      />
    );
  }

  if (isEmpty) {
    return <TransactionsEmptyState onAddPress={onAddPress} />;
  }

  return (
    <FlatList
      data={rows}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerClassName="px-6 pb-8"
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.4}
      removeClippedSubviews
      initialNumToRender={12}
      maxToRenderPerBatch={12}
      windowSize={8}
      updateCellsBatchingPeriod={50}
      ItemSeparatorComponent={() => <View className="h-3" />}
      ListFooterComponent={
        isLoadingMore ? (
          <View className="items-center py-6">
            <ActivityIndicator color="hsl(144, 16%, 37%)" />
          </View>
        ) : null
      }
    />
  );
}
