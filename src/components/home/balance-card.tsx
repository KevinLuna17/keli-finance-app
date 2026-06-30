import { formatMoney } from "@/lib/format-money";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

type BalanceCardProps = {
  label: string;
  amountInSmallestUnits: number;
  incomeInSmallestUnits: number;
  expenseInSmallestUnits: number;
  incomeLabel?: string;
  expenseLabel?: string;
};

type SummaryStatProps = {
  label: string;
  amountInSmallestUnits: number;
  icon: React.ComponentProps<typeof FontAwesome6>["name"];
};

function SummaryStat({ label, amountInSmallestUnits, icon }: SummaryStatProps) {
  return (
    <View className="flex-1 rounded-2xl bg-white/20 px-4 py-3">
      <View className="flex-row items-center gap-2">
        <FontAwesome6 name={icon} size={12} color="#FFFFFF" />
        <Text className="text-xs font-medium text-brand-foreground/80">
          {label}
        </Text>
      </View>
      <Text className="mt-2 text-lg font-bold text-brand-foreground">
        {formatMoney(amountInSmallestUnits)}
      </Text>
    </View>
  );
}

export default function BalanceCard({
  label,
  amountInSmallestUnits,
  incomeInSmallestUnits,
  expenseInSmallestUnits,
  incomeLabel,
  expenseLabel,
}: BalanceCardProps) {
  const { t } = useTranslation();
  const resolvedIncomeLabel = incomeLabel ?? t("income");
  const resolvedExpenseLabel = expenseLabel ?? t("expense");

  return (
    <View className="relative overflow-hidden rounded-3xl bg-brand p-6 shadow-md">
      <View className="absolute -right-10 -top-10 size-40 rounded-full bg-white/10" />
      <View className="absolute right-6 top-10 size-24 rounded-full bg-white/5" />

      <Text className="text-sm font-medium text-brand-foreground/80">
        {label}
      </Text>
      <Text className="mt-1 text-3xl font-bold text-brand-foreground">
        {formatMoney(amountInSmallestUnits)}
      </Text>

      <View className="mt-6 flex-row gap-3">
        <SummaryStat
          label={resolvedIncomeLabel}
          amountInSmallestUnits={incomeInSmallestUnits}
          icon="arrow-down"
        />
        <SummaryStat
          label={resolvedExpenseLabel}
          amountInSmallestUnits={expenseInSmallestUnits}
          icon="arrow-up"
        />
      </View>
    </View>
  );
}
