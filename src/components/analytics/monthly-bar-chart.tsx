import { useAnalyticsChartTheme } from "@/components/analytics/use-analytics-chart-theme";
import { useFormatCurrency } from "@/hooks/use-format-currency";
import { matchFont } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import { Platform, Text, View } from "react-native";
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

const Y_TICK_COUNT = 4;

export function MonthlyBarChart({
  data,
  height = 240,
  incomeLabel,
  expenseLabel,
}: MonthlyBarChartProps) {
  const { t } = useTranslation();
  const { chartFormatter } = useFormatCurrency();
  const theme = useAnalyticsChartTheme();

  // Axis labels are drawn by Skia and need a font; the system font avoids bundling one.
  const font = useMemo(
    () =>
      matchFont({
        fontFamily: Platform.select({ ios: "Helvetica", default: "sans-serif" }),
        fontSize: 11,
      }),
    [],
  );

  const resolvedIncomeLabel = incomeLabel ?? t("income");
  const resolvedExpenseLabel = expenseLabel ?? t("expense");

  return (
    <View>
      <View style={{ height }}>
        <CartesianChart
          data={data}
          xKey="month"
          yKeys={["income", "expense"]}
          domain={{ y: [0] }}
          domainPadding={{ left: 24, right: 24, top: 16 }}
          padding={{ left: 4, right: 4, top: 8, bottom: 4 }}
          xAxis={{
            font,
            tickCount: data.length,
            labelColor: theme.axis,
            lineColor: theme.grid,
            lineWidth: 0,
          }}
          yAxis={[
            {
              font,
              tickCount: Y_TICK_COUNT,
              labelColor: theme.axis,
              lineColor: theme.grid,
              formatYLabel: (value) => chartFormatter(Number(value)),
            },
          ]}
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
      </View>

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
