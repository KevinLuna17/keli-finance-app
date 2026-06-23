import { useTheme } from "@react-navigation/native";
import React from "react";
import { type ViewProps } from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";

export type ScreenBackground = "theme" | "custom" | "modal";

export type ScreenLayoutProps = ViewProps & {
  edges?: Edge[];
  /**
   * "theme" — React Navigation background (DefaultTheme / DarkTheme).
   * "custom" — app tokens via bg-background / dark:bg-secondary (tab screens).
   * "modal" — card surface via bg-card (white in light mode). Use for modals/sheets only.
   * @default "theme"
   */
  background?: ScreenBackground;
};

const CUSTOM_BACKGROUND_CLASS = "bg-background dark:bg-secondary";
const MODAL_BACKGROUND_CLASS = "bg-card";

export default function ScreenLayout({
  children,
  edges = ["top"],
  background = "theme",
  className,
  style,
  ...rest
}: ScreenLayoutProps) {
  const { colors } = useTheme();
  const isCustomBackground = background === "custom";
  const isModalBackground = background === "modal";

  const layoutClassName = isCustomBackground
    ? `flex-1 ${CUSTOM_BACKGROUND_CLASS}${className ? ` ${className}` : ""}`
    : isModalBackground
      ? `flex-1 ${MODAL_BACKGROUND_CLASS}${className ? ` ${className}` : ""}`
      : `flex-1${className ? ` ${className}` : ""}`;

  const layoutStyle = isCustomBackground
    ? style
    : isModalBackground
      ? [{ backgroundColor: colors.card }, style]
      : [{ backgroundColor: colors.background }, style];

  return (
    <SafeAreaView
      edges={edges}
      className={layoutClassName}
      style={layoutStyle}
      {...rest}
    >
      {children}
    </SafeAreaView>
  );
}
