import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type StatisticsEmptyStateProps = {
  title?: string;
  message?: string;
};

export function StatisticsEmptyState({
  title = "No insights yet",
  message = "Add income and expense transactions to unlock charts and summaries for this workspace.",
}: StatisticsEmptyStateProps) {
  return (
    <View className="items-center rounded-2xl bg-card px-6 py-10 shadow-sm">
      <View className="size-16 items-center justify-center rounded-full bg-muted">
        <FontAwesome6 name="chart-pie" size={28} color="#508A67" />
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
