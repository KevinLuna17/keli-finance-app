import React from "react";
import { ActivityIndicator, View } from "react-native";

export default function AuthLoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background dark:bg-secondary">
      <ActivityIndicator size="large" />
    </View>
  );
}
