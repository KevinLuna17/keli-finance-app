import { useFormatCurrency } from "@/hooks/use-format-currency";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Pie, PolarChart } from "victory-native";

export type CategoryPieChartDatum = {
  label: string;
  value: number;
  color: string;
};

export type CategoryPieChartProps = {
  data: CategoryPieChartDatum[];
  height?: number;
  totalLabel?: string;
};

export function CategoryPieChart({
  data,
  height = 280,
  totalLabel,
}: CategoryPieChartProps) {
  const { formatAmount } = useFormatCurrency();
  const pieHeight = Math.min(height, 220);

  const { legendItems, total } = useMemo(() => {
    const sum = data.reduce((acc, entry) => acc + entry.value, 0);
    return {
      total: sum,
      legendItems: data.map((item) => ({
        ...item,
        percentage: sum > 0 ? Math.round((item.value / sum) * 100) : 0,
      })),
    };
  }, [data]);

  return (
    <View style={{ minHeight: height }}>
      <View style={{ height: pieHeight }}>
        <PolarChart
          data={data}
          labelKey="label"
          valueKey="value"
          colorKey="color"
        >
          <Pie.Chart innerRadius="55%" />
        </PolarChart>

        {totalLabel ? (
          <View
            style={StyleSheet.absoluteFillObject}
            className="items-center justify-center"
            pointerEvents="none"
          >
            <Text
              className="text-lg font-bold text-foreground"
              adjustsFontSizeToFit
              numberOfLines={1}
              style={{ maxWidth: "45%" }}
            >
              {formatAmount(total)}
            </Text>
            <Text className="mt-0.5 text-xs text-muted-foreground">
              {totalLabel}
            </Text>
          </View>
        ) : null}
      </View>

      <View className="mt-4 gap-3">
        {legendItems.map((item) => (
          <View
            key={item.label}
            className="flex-row items-center gap-3"
          >
            <View
              className="size-3 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <Text
              className="flex-1 text-sm font-medium text-foreground"
              numberOfLines={1}
            >
              {item.label}
            </Text>
            <Text className="text-sm font-semibold text-foreground">
              {formatAmount(item.value)}
            </Text>
            <Text className="w-10 text-right text-xs text-muted-foreground">
              {item.percentage}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
