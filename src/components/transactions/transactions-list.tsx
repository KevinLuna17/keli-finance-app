import { TransactionDateHeader } from "@/components/transactions/transaction-date-header";
import { TransactionListItem } from "@/components/transactions/transaction-list-item";
import { TransactionsEmptyState } from "@/components/transactions/transactions-empty-state";
import { TransactionsErrorState } from "@/components/transactions/transactions-error-state";
import { TransactionListRow } from "@/lib/transaction-list-utils";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from "react-native";

type TransactionsListProps = {
  rows: TransactionListRow[];
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
  const renderItem = useCallback(({ item }: { item: TransactionListRow }) => {
    if (item.type === "header") {
      return <TransactionDateHeader label={item.label} />;
    }

    return <TransactionListItem transaction={item.transaction} />;
  }, []);

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
        message={errorMessage ?? "Something went wrong"}
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
