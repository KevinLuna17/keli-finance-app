import ScreenLayout from "@/components/ui/ScreenLayout";
import { useClerk } from "@clerk/expo";
import React from "react";
import { Pressable, Text, View } from "react-native";

export default function profile() {
  const { signOut } = useClerk();
  return (
    <ScreenLayout edges={["top"]} background="custom">
      <View className="flex-1 px-6">
        <Pressable
          className="mt-8 h-14 items-center justify-center rounded-2xl border border-border bg-card active:opacity-90"
          onPress={() => signOut()}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
        >
          <Text className="text-base font-bold text-destructive">Sign out</Text>
        </Pressable>
      </View>
    </ScreenLayout>
  );
}
