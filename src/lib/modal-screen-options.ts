import type { Theme } from "expo-router";

/** Shared stack options for modal routes. Keeps header and content on the card surface. */
export function getModalStackScreenOptions(
  colors: Theme["colors"],
  backTitle?: string,
) {
  return {
    presentation: "modal" as const,
    headerBackTitle: backTitle,
    headerTitleAlign: "center" as const,
    headerStyle: { backgroundColor: colors.card },
    headerTitleStyle: { color: colors.text },
    headerTintColor: colors.text,
    contentStyle: { backgroundColor: colors.card },
  };
}
