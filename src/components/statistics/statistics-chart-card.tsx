import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type StatisticsChartCardProps = {
  title: string;
  subtitle?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  chartHeight?: number;
  children: React.ReactNode;
};

export function StatisticsChartCard({
  title,
  subtitle,
  isLoading = false,
  isEmpty = false,
  emptyMessage = "No data for this period yet.",
  chartHeight = 280,
  children,
}: StatisticsChartCardProps) {
  return (
    <View className="rounded-2xl bg-card p-4 shadow-sm">
      <Text className="text-base font-bold text-foreground">{title}</Text>
      {subtitle ? (
        <Text className="mt-1 text-sm text-muted-foreground">{subtitle}</Text>
      ) : null}

      <View className="mt-4" style={{ minHeight: chartHeight }}>
        {isLoading ? (
          <View
            className="items-center justify-center rounded-xl bg-muted/40"
            style={{ height: chartHeight }}
          >
            <View className="h-40 w-full rounded-xl bg-muted px-4 py-6">
              <View className="mt-auto flex-row items-end justify-between gap-2">
                {[48, 72, 56, 88, 64, 96, 52, 80, 60, 74, 68, 84].map(
                  (height, index) => (
                    <View
                      key={index}
                      className="flex-1 rounded-t-md bg-muted-foreground/20"
                      style={{ height: height * 0.6 }}
                    />
                  ),
                )}
              </View>
            </View>
          </View>
        ) : isEmpty ? (
          <View
            className="items-center justify-center rounded-xl bg-muted/30 px-4"
            style={{ height: chartHeight }}
          >
            <View className="size-12 items-center justify-center rounded-full bg-muted">
              <FontAwesome6 name="chart-column" size={20} color="#508A67" />
            </View>
            <Text className="mt-3 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </Text>
          </View>
        ) : (
          children
        )}
      </View>
    </View>
  );
}
