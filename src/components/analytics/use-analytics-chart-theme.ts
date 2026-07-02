import { useColorScheme } from "react-native";

export type AnalyticsChartTheme = {
  income: string;
  expense: string;
  axis: string;
  grid: string;
  brand: string;
  palette: readonly string[];
};

const LIGHT_THEME: AnalyticsChartTheme = {
  income: "#22A06B",
  expense: "#E5484D",
  axis: "#6B7F72",
  grid: "#D8E4DC",
  brand: "#508A67",
  palette: [
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
  ],
};

const DARK_THEME: AnalyticsChartTheme = {
  income: "#4ADE80",
  expense: "#F87171",
  axis: "#94A3B8",
  grid: "#334155",
  brand: "#7BC4A3",
  palette: [
    "#7BC4A3",
    "#508A67",
    "#F5C842",
    "#F87171",
    "#84A98C",
    "#A4C3B2",
    "#6B9080",
    "#CDB4DB",
    "#457B63",
    "#BC6C25",
  ],
};

export function useAnalyticsChartTheme(): AnalyticsChartTheme {
  const colorScheme = useColorScheme();
  return colorScheme === "dark" ? DARK_THEME : LIGHT_THEME;
}

export function getChartColorFromTheme(
  theme: AnalyticsChartTheme,
  index: number,
): string {
  return theme.palette[index % theme.palette.length];
}
