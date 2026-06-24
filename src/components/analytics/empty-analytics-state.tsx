import { useAnalyticsChartTheme } from "@/components/analytics/use-analytics-chart-theme";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export type EmptyAnalyticsStateProps = {
  title?: string;
  message?: string;
  icon?: React.ComponentProps<typeof FontAwesome6>["name"];
  className?: string;
};

export function EmptyAnalyticsState({
  title = "No insights yet",
  message = "Add income and expense transactions to unlock charts and summaries for this workspace.",
  icon = "chart-pie",
  className,
}: EmptyAnalyticsStateProps) {
  const theme = useAnalyticsChartTheme();

  return (
    <View
      className={`items-center rounded-2xl bg-card px-6 py-10 shadow-sm dark:shadow-none${className ? ` ${className}` : ""}`}
    >
      <View className="size-16 items-center justify-center rounded-full bg-muted dark:bg-muted/80">
        <FontAwesome6 name={icon} size={28} color={theme.brand} />
      </View>
      <Text className="mt-4 text-center text-lg font-bold text-foreground">
        {title}
      </Text>
      <Text className="mt-2 text-center text-base leading-6 text-muted-foreground">
        {message}
      </Text>
    </View>
  );
}
