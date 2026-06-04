import React from "react";
import { View } from "react-native";

export default function Bubbles() {
  return (
    <>
      <View className="absolute -top-8 -left-4 size-40 rounded-full bg-card/20 blur-3xl dark:bg-background/40" />
      <View className="absolute right-[-74px] top-40 h-72 w-72 rounded-full bg-card/20 blur-3xl dark:bg-background/35" />
    </>
  );
}
