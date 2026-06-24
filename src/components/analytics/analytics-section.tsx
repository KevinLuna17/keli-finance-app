import { useAnalyticsChartTheme } from "@/components/analytics/use-analytics-chart-theme";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export type AnalyticsSectionProps = {
  title: string;
  subtitle?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  contentHeight?: number;
  children: React.ReactNode;
  className?: string;
};

export function AnalyticsSection({
  title,
  subtitle,
  isLoading = false,
  isEmpty = false,
  emptyMessage = "No data for this period yet.",
  contentHeight = 280,
  children,
  className,
}: AnalyticsSectionProps) {
  const theme = useAnalyticsChartTheme();

  return (
    <View
      className={`rounded-2xl bg-card p-4 shadow-sm dark:shadow-none${className ? ` ${className}` : ""}`}
    >
      <Text className="text-base font-bold text-foreground">{title}</Text>
      {subtitle ? (
        <Text className="mt-1 text-sm text-muted-foreground">{subtitle}</Text>
      ) : null}

      <View className="mt-4" style={{ minHeight: contentHeight }}>
        {isLoading ? (
          <View
            className="items-center justify-center rounded-xl bg-muted/40 dark:bg-muted/20"
            style={{ height: contentHeight }}
          >
            <View className="h-40 w-full rounded-xl bg-muted px-4 py-6 dark:bg-muted/60">
              <View className="mt-auto flex-row items-end justify-between gap-2">
                {[48, 72, 56, 88, 64, 96, 52, 80, 60, 74, 68, 84].map(
                  (height, index) => (
                    <View
                      key={index}
                      className="flex-1 rounded-t-md bg-muted-foreground/20 dark:bg-muted-foreground/30"
                      style={{ height: height * 0.6 }}
                    />
                  ),
                )}
              </View>
            </View>
          </View>
        ) : isEmpty ? (
          <View
            className="items-center justify-center rounded-xl bg-muted/30 px-4 dark:bg-muted/20"
            style={{ height: contentHeight }}
          >
            <View className="size-12 items-center justify-center rounded-full bg-muted dark:bg-muted/80">
              <FontAwesome6
                name="chart-column"
                size={20}
                color={theme.brand}
              />
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
