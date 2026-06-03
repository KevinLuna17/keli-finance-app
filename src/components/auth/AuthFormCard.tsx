import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AuthFormCardProps {
  children: React.ReactNode;
}

export function AuthFormCard({ children }: AuthFormCardProps) {
  return (
    <View className="-mt-16 flex-1 rounded-t-[36px] bg-card shadow-md">
      <SafeAreaView edges={["bottom"]} className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            className="flex-1"
            contentContainerClassName="grow px-6 pb-4 pt-8"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
