import React from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AuthFormCardProps {
  children: React.ReactNode;
}

export function AuthFormCard({ children }: AuthFormCardProps) {
  return (
    <View className="-mt-12 flex-1 rounded-t-[36px] bg-card shadow-md">
      <SafeAreaView edges={["bottom"]} className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <View className="flex-1 px-6 pb-4 pt-8">{children}</View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
