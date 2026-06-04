import React from "react";
import { type ViewProps } from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";

export type ScreenLayoutProps = ViewProps & {
  edges?: Edge[];
};

export default function ScreenLayout({
  children,
  edges = ["top"],
  ...rest
}: ScreenLayoutProps) {
  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-secondary"
      edges={edges}
      {...rest}
    >
      {children}
    </SafeAreaView>
  );
}
