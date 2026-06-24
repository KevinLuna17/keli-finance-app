import {
  CHART_AXIS_COLOR,
  CHART_EXPENSE_COLOR,
  CHART_GRID_COLOR,
  CHART_INCOME_COLOR,
} from "@/lib/chart-colors";
import { formatChartAxisMoney } from "@/lib/chart-money";
import { MonthlyChartDatum } from "@/lib/statistics-helpers";
import React from "react";
import { Text, View } from "react-native";
import { BarGroup, CartesianChart } from "victory-native";

type MonthlyIncomeExpenseChartProps = {
  data: MonthlyChartDatum[];
  height?: number;
};

export function MonthlyIncomeExpenseChart({
  data,
  height = 280,
}: MonthlyIncomeExpenseChartProps) {
  return (
    <View style={{ height }}>
      <CartesianChart
        data={data}
        xKey="month"
        yKeys={["income", "expense"]}
        domainPadding={{ left: 20, right: 20, top: 20 }}
        padding={{ left: 8, right: 8, top: 12, bottom: 8 }}
        axisOptions={{
          lineColor: CHART_GRID_COLOR,
          labelColor: CHART_AXIS_COLOR,
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
            <BarGroup.Bar points={points.income} color={CHART_INCOME_COLOR} />
            <BarGroup.Bar points={points.expense} color={CHART_EXPENSE_COLOR} />
          </BarGroup>
        )}
      </CartesianChart>

      <View className="mt-3 flex-row items-center justify-center gap-5">
        <LegendDot color={CHART_INCOME_COLOR} label="Income" />
        <LegendDot color={CHART_EXPENSE_COLOR} label="Expense" />
      </View>
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View className="flex-row items-center gap-2">
      <View className="size-3 rounded-sm" style={{ backgroundColor: color }} />
      <Text className="text-xs font-medium text-muted-foreground">{label}</Text>
    </View>
  );
}
