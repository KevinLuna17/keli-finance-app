import { useAnalyticsChartTheme } from "@/components/analytics/use-analytics-chart-theme";
import { formatChartAxisMoney } from "@/lib/chart-money";
import React from "react";
import { Text, View } from "react-native";
import { BarGroup, CartesianChart } from "victory-native";
import { useTranslation } from "react-i18next";

export type MonthlyBarChartDatum = {
  month: string;
  income: number;
  expense: number;
};

export type MonthlyBarChartProps = {
  data: MonthlyBarChartDatum[];
  height?: number;
  incomeLabel?: string;
  expenseLabel?: string;
};

export function MonthlyBarChart({
  data,
  height = 280,
  incomeLabel,
  expenseLabel,
}: MonthlyBarChartProps) {
  const { t } = useTranslation();
  const theme = useAnalyticsChartTheme();

  const resolvedIncomeLabel = incomeLabel ?? t("income");
  const resolvedExpenseLabel = expenseLabel ?? t("expense");

  return (
    <View style={{ height }}>
      <CartesianChart
        data={data}
        xKey="month"
        yKeys={["income", "expense"]}
        domainPadding={{ left: 20, right: 20, top: 20 }}
        padding={{ left: 8, right: 8, top: 12, bottom: 8 }}
        axisOptions={{
          lineColor: theme.grid,
          labelColor: theme.axis,
          formatYLabel: formatChartAxisMoney,
        }}
      >
        {({ points, chartBounds }) => (
          <BarGroup
            chartBounds={chartBounds}
            betweenGroupPadding={0.35}
            withinGroupPadding={0.15}
            roundedCorners={{ topLeft: 4, topRight: 4 }}
          >
            <BarGroup.Bar points={points.income} color={theme.income} />
            <BarGroup.Bar points={points.expense} color={theme.expense} />
          </BarGroup>
        )}
      </CartesianChart>

      <View className="mt-3 flex-row items-center justify-center gap-5">
        <ChartLegendDot color={theme.income} label={resolvedIncomeLabel} />
        <ChartLegendDot color={theme.expense} label={resolvedExpenseLabel} />
      </View>
    </View>
  );
}

function ChartLegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View className="flex-row items-center gap-2">
      <View className="size-3 rounded-sm" style={{ backgroundColor: color }} />
      <Text className="text-xs font-medium text-muted-foreground">{label}</Text>
    </View>
  );
}
