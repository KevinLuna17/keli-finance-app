import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface AuthFieldErrorProps {
  message: string;
}

export function AuthFieldError({ message }: AuthFieldErrorProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      className="mb-3 flex-row items-center rounded-2xl border border-destructive bg-destructive/10 px-4 py-2"
    >
      <FontAwesome name="exclamation-triangle" size={16} color="#DC2626" />
      <Text className="ml-2 flex-1 text-red-500">{message}</Text>
    </Animated.View>
  );
}
