import type { Theme } from "@react-navigation/native";

/** Shared stack options for modal routes. Keeps header and content on the card surface. */
export function getModalStackScreenOptions(colors: Theme["colors"]) {
  return {
    presentation: "modal" as const,
    headerBackTitle: "Back",
    headerTitleAlign: "center" as const,
    headerStyle: { backgroundColor: colors.card },
    contentStyle: { backgroundColor: colors.card },
  };
}
