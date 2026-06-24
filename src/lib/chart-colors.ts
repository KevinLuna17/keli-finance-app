export const CHART_COLORS = [
  "#508A67",
  "#7BC4A3",
  "#F5C842",
  "#E85D5D",
  "#6B9080",
  "#A4C3B2",
  "#457B63",
  "#CDB4DB",
  "#84A98C",
  "#BC6C25",
] as const;

export const CHART_INCOME_COLOR = "#22A06B";
export const CHART_EXPENSE_COLOR = "#E5484D";
export const CHART_AXIS_COLOR = "#8A9A8E";
export const CHART_GRID_COLOR = "#D8E4DC";

export function getChartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}
