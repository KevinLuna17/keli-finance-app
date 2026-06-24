import { formatMoney } from "@/lib/format-money";
import { AnalyticsSummary } from "@/services/analytics/analytics.types";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type SummaryCardProps = {
  label: string;
  amountInSmallestUnits: number;
  icon: React.ComponentProps<typeof FontAwesome6>["name"];
  accentClassName: string;
};

function SummaryCard({
  label,
  amountInSmallestUnits,
  icon,
  accentClassName,
}: SummaryCardProps) {
  return (
    <View className="min-w-[46%] flex-1 rounded-2xl bg-card p-4 shadow-sm">
      <View className="flex-row items-center gap-2">
        <View
          className={`size-8 items-center justify-center rounded-full ${accentClassName}`}
        >
          <FontAwesome6 name={icon} size={12} color="#FFFFFF" />
        </View>
        <Text className="text-xs font-medium text-muted-foreground">
          {label}
        </Text>
      </View>
      <Text className="mt-3 text-xl font-bold text-foreground">
        {formatMoney(amountInSmallestUnits)}
      </Text>
    </View>
  );
}

function SummaryCardSkeleton() {
  return (
    <View className="min-w-[46%] flex-1 rounded-2xl bg-card p-4 shadow-sm">
      <View className="h-8 w-24 rounded-full bg-muted" />
      <View className="mt-3 h-7 w-28 rounded-lg bg-muted" />
    </View>
  );
}

type StatisticsSummaryCardsProps = {
  summary: AnalyticsSummary;
  isLoading?: boolean;
};

export function StatisticsSummaryCards({
  summary,
  isLoading = false,
}: StatisticsSummaryCardsProps) {
  if (isLoading) {
    return (
      <View className="flex-row flex-wrap gap-3">
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
      </View>
    );
  }

  return (
    <View className="flex-row flex-wrap gap-3">
      <SummaryCard
        label="Balance"
        amountInSmallestUnits={summary.balance}
        icon="wallet"
        accentClassName="bg-brand"
      />
      <SummaryCard
        label="Income"
        amountInSmallestUnits={summary.totalIncome}
        icon="arrow-down"
        accentClassName="bg-success"
      />
      <SummaryCard
        label="Expenses"
        amountInSmallestUnits={summary.totalExpenses}
        icon="arrow-up"
        accentClassName="bg-destructive"
      />
      <SummaryCard
        label="Savings"
        amountInSmallestUnits={summary.savings}
        icon="piggy-bank"
        accentClassName="bg-accent"
      />
    </View>
  );
}
