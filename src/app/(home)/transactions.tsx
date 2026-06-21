import { TransactionsList } from "@/components/transactions/transactions-list";
import ScreenLayout from "@/components/ui/ScreenLayout";
import { useTransactionsList } from "@/hooks/use-transactions-list";
import { MOCK_WORKSPACE_ID } from "@/mocks/workspace";
import { Href, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useRef } from "react";
import { Pressable, Text, View } from "react-native";

export default function TransactionsScreen() {
  const router = useRouter();
  const isFirstFocus = useRef(true);
  const {
    rows,
    error,
    refresh,
    loadMore,
    retry,
    isInitialLoading,
    isRefreshing,
    isLoadingMore,
    isEmpty,
    hasError,
  } = useTransactionsList({ workspaceId: MOCK_WORKSPACE_ID });

  const handleAddPress = useCallback(() => {
    router.push("/transaction/new" as Href);
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }

      refresh();
    }, [refresh]),
  );

  return (
    <ScreenLayout edges={["top"]} background="custom" className="flex-1">
      <View className="flex-row items-center justify-between px-6 pb-4 pt-6">
        <Text className="text-2xl font-bold text-foreground">Transactions</Text>
        <Pressable
          className="rounded-full bg-brand px-4 py-2"
          onPress={handleAddPress}
          accessibilityRole="button"
          accessibilityLabel="Add transaction"
        >
          <Text className="text-sm font-semibold text-brand-foreground">Add</Text>
        </Pressable>
      </View>

      <TransactionsList
        rows={rows}
        isInitialLoading={isInitialLoading}
        isRefreshing={isRefreshing}
        isLoadingMore={isLoadingMore}
        isEmpty={isEmpty}
        hasError={hasError}
        errorMessage={error}
        onRefresh={refresh}
        onLoadMore={loadMore}
        onRetry={retry}
        onAddPress={handleAddPress}
      />
    </ScreenLayout>
  );
}
