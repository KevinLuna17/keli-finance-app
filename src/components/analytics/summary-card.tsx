import { formatMoney } from "@/lib/format-money";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export type SummaryCardAccent = "brand" | "success" | "destructive" | "accent";

export type SummaryCardProps = {
  label: string;
  amountInSmallestUnits: number;
  icon: React.ComponentProps<typeof FontAwesome6>["name"];
  accent?: SummaryCardAccent;
  isLoading?: boolean;
  className?: string;
};

const ACCENT_CLASS: Record<SummaryCardAccent, string> = {
  brand: "bg-brand",
  success: "bg-success",
  destructive: "bg-destructive",
  accent: "bg-accent",
};

function SummaryCardSkeleton({ className }: { className?: string }) {
  return (
    <View
      className={`min-w-[46%] flex-1 rounded-2xl bg-card p-4 shadow-sm dark:shadow-none${className ? ` ${className}` : ""}`}
    >
      <View className="h-8 w-24 rounded-full bg-muted" />
      <View className="mt-3 h-7 w-28 rounded-lg bg-muted" />
    </View>
  );
}

export function SummaryCard({
  label,
  amountInSmallestUnits,
  icon,
  accent = "brand",
  isLoading = false,
  className,
}: SummaryCardProps) {
  if (isLoading) {
    return <SummaryCardSkeleton className={className} />;
  }

  return (
    <View
      className={`min-w-[46%] flex-1 rounded-2xl bg-card p-4 shadow-sm dark:shadow-none${className ? ` ${className}` : ""}`}
    >
      <View className="flex-row items-center gap-2">
        <View
          className={`size-8 items-center justify-center rounded-full ${ACCENT_CLASS[accent]}`}
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
