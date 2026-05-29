import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Bubbles from "../Bubbles";
import ScreenLayout from "../ui/ScreenLayout";

interface AuthStepScreenProps {
  title: string;
  subtitle?: string;
  badge: string;
  children: React.ReactNode;
}

export function AuthStepScreen({
  title,
  subtitle,
  badge,
  children,
}: AuthStepScreenProps) {
  return (
    <ScreenLayout edges={["top", "bottom"]}>
      <Bubbles />

      <View className="flex-1 px-6 pt-4">
        <Animated.View
          entering={FadeInDown.delay(100).duration(500)}
          className="mt-8"
        >
          <Text className="mt-4 text-center text-3xl font-extrabold text-brand dark:text-foreground">
            {title}
          </Text>

          {subtitle ? (
            <Text className="mt-2 text-center text-base leading-6 text-secondary-foreground dark:text-foreground/75">
              {subtitle}
            </Text>
          ) : null}
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          className="mt-8 rounded-[20px] bg-card p-8"
        >
          <View className="self-center rounded-full bg-secondary px-3 py-1">
            <Text className="text-xs font-semibold uppercase tracking-[1px] text-secondary-foreground">
              {badge}
            </Text>
          </View>

          {children}
        </Animated.View>
      </View>
    </ScreenLayout>
  );
}
