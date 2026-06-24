import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import React from "react";
import {
  Platform,
  Pressable,
  type PressableProps,
  View,
  type ViewProps,
} from "react-native";

type ProfileGlassCardProps = ViewProps & {
  children: React.ReactNode;
  contentClassName?: string;
  radius?: number;
  interactive?: boolean;
  dashed?: boolean;
  tintColor?: string;
  borderClassName?: string;
};

function useNativeGlass(dashed: boolean): boolean {
  return Platform.OS === "ios" && isLiquidGlassAvailable() && !dashed;
}

export function ProfileGlassCard({
  children,
  className,
  contentClassName,
  radius = 24,
  interactive = false,
  dashed = false,
  tintColor,
  borderClassName,
  style,
  ...rest
}: ProfileGlassCardProps) {
  const useGlass = useNativeGlass(dashed);

  const borderClass =
    borderClassName ??
    (dashed
      ? "border border-dashed border-border/50"
      : "border border-white/45 dark:border-white/10");

  const fallbackSurfaceClass =
    "bg-white/50 shadow-sm dark:bg-card/40";

  if (useGlass) {
    return (
      <GlassView
        glassEffectStyle="regular"
        isInteractive={interactive}
        tintColor={tintColor}
        style={[
          {
            borderRadius: radius,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.45)",
          },
          style,
        ]}
        {...rest}
      >
        <View className={contentClassName}>{children}</View>
      </GlassView>
    );
  }

  return (
    <View
      style={[{ borderRadius: radius }, style]}
      className={`overflow-hidden ${borderClass} ${fallbackSurfaceClass} ${
        className ?? ""
      }`}
      {...rest}
    >
      <View className={contentClassName}>{children}</View>
    </View>
  );
}

type ProfileGlassPressableProps = PressableProps & {
  children: React.ReactNode;
  contentClassName?: string;
  radius?: number;
  active?: boolean;
  dashed?: boolean;
};

export function ProfileGlassPressable({
  children,
  className,
  contentClassName,
  radius = 16,
  active = false,
  dashed = false,
  style,
  ...pressableProps
}: ProfileGlassPressableProps) {
  const useGlass = useNativeGlass(dashed);

  const activeBorderColor = "#508A67";
  const defaultBorderColor = "rgba(255, 255, 255, 0.45)";

  if (useGlass) {
    return (
      <Pressable
        className={className}
        style={style}
        {...pressableProps}
      >
        <GlassView
          glassEffectStyle="regular"
          isInteractive
          tintColor={active ? "rgba(80, 138, 103, 0.14)" : undefined}
          style={{
            borderRadius: radius,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: active ? activeBorderColor : defaultBorderColor,
          }}
        >
          <View className={contentClassName}>{children}</View>
        </GlassView>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={style}
      className={`overflow-hidden rounded-2xl border shadow-sm active:opacity-90 ${
        active
          ? "border-brand bg-brand/10"
          : "border-white/45 bg-white/50 dark:border-white/10 dark:bg-card/40"
      } ${className ?? ""}`}
      {...pressableProps}
    >
      <View className={contentClassName}>{children}</View>
    </Pressable>
  );
}
