import { formatMoney } from "@/lib/format-money";
import { CategoryChartDatum } from "@/lib/statistics-helpers";
import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { Pie, PolarChart } from "victory-native";

type CategoryBreakdownChartProps = {
  data: CategoryChartDatum[];
  height?: number;
};

export function CategoryBreakdownChart({
  data,
  height = 280,
}: CategoryBreakdownChartProps) {
  const pieHeight = Math.min(height, 220);

  const legendItems = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        percentage:
          data.reduce((total, entry) => total + entry.value, 0) > 0
            ? Math.round(
                (item.value /
                  data.reduce((total, entry) => total + entry.value, 0)) *
                  100,
              )
            : 0,
      })),
    [data],
  );

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
      </View>

      <View className="mt-2 gap-2">
        {legendItems.map((item) => (
          <View
            key={item.label}
            className="flex-row items-center justify-between gap-3"
          >
            <View className="flex-1 flex-row items-center gap-2">
              <View
                className="size-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <Text
                className="flex-1 text-sm text-foreground"
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </View>
            <Text className="text-sm font-semibold text-foreground">
              {formatMoney(Math.round(item.value * 100))}
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
