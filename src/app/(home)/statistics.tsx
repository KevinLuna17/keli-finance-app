import { EmptyAnalyticsState } from "@/components/analytics";
import { StatisticsChartsSection } from "@/components/statistics/statistics-charts-section";
import {
  StatisticsSegment,
  StatisticsSegmentControl,
} from "@/components/statistics/statistics-segment";
import { StatisticsSummaryCards } from "@/components/statistics/statistics-summary-cards";
import { TransactionsErrorState } from "@/components/transactions/transactions-error-state";
import ScreenLayout from "@/components/ui/ScreenLayout";
import { useStatisticsAnalytics } from "@/hooks/use-statistics-analytics";
import { useBackendSync } from "@/hooks/useBackendSync";
import { isStatisticsEmpty } from "@/lib/statistics-helpers";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

const TAB_BAR_HEIGHT = 56;

export default function StatisticsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const isFirstFocus = useRef(true);
  const [segment, setSegment] = useState<StatisticsSegment>("overview");
  const { currentWorkspace } = useBackendSync();
  const workspaceId = currentWorkspace?.id;
  const { data, isLoading, error, refresh } =
    useStatisticsAnalytics(workspaceId);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refresh();
    } finally {
      setIsRefreshing(false);
    }
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }

      refresh();
    }, [refresh]),
  );

  if (error && !isLoading) {
    return (
      <ScreenLayout edges={["top"]} background="custom" className="flex-1">
        <TransactionsErrorState message={error} onRetry={refresh} />
      </ScreenLayout>
    );
  }

  const showGlobalEmpty = !isLoading && isStatisticsEmpty(data);

  return (
    <ScreenLayout edges={["top"]} background="custom" className="flex-1">
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{
          paddingTop: 24,
          paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 24,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <View>
          <Text className="text-sm text-muted-foreground">{t("statistics.insights")}</Text>
          <Text className="mt-1 text-2xl font-bold text-foreground">
            {t("statistics.title")}
          </Text>
        </View>

        <View className="mt-6">
          <StatisticsSummaryCards summary={data.summary} isLoading={isLoading} />
        </View>

        <View className="mt-6">
          <StatisticsSegmentControl
            value={segment}
            onChange={setSegment}
            disabled={isLoading}
          />
        </View>

        <View className="mt-6">
          {showGlobalEmpty ? (
            <EmptyAnalyticsState />
          ) : (
            <StatisticsChartsSection
              segment={segment}
              expensesByCategory={data.expensesByCategory}
              incomeByCategory={data.incomeByCategory}
              isLoading={isLoading}
            />
          )}
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
