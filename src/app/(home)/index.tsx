import ScreenLayout from "@/components/ui/ScreenLayout";
import { useAuth, useClerk, useUser } from "@clerk/expo";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

export default function HomeScreen() {
  const { isLoaded } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

  const displayName =
    user?.firstName ??
    user?.emailAddresses[0]?.emailAddress ??
    "there";

  if (!isLoaded) {
    return (
      <ScreenLayout className="items-center justify-center">
        <ActivityIndicator size="large" color="hsl(144, 16%, 37%)" />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout edges={["top"]} className="px-6 pb-8">
      <View className="pt-6">
        <Text className="text-xs font-semibold uppercase tracking-[1px] text-muted-foreground">
          Keli
        </Text>
        <Text className="mt-2 text-3xl font-extrabold text-brand">
          Hi, {displayName}
        </Text>
        <Text className="mt-2 text-base leading-6 text-muted-foreground">
          Your financial coach is ready. Spending insights and budgets will
          live here soon.
        </Text>
      </View>

      <View className="mt-8 rounded-[20px] border border-border bg-card p-6">
        <View className="flex-row items-center">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
            <FontAwesome6
              name="seedling"
              size={22}
              color="hsl(144, 16%, 37%)"
            />
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-lg font-bold text-card-foreground">
              Coming next
            </Text>
            <Text className="mt-1 text-sm leading-5 text-muted-foreground">
              Track spending, set goals, and get AI guidance tailored to you.
            </Text>
          </View>
        </View>
      </View>

      <Pressable
        className="mt-8 h-14 items-center justify-center rounded-2xl border border-border bg-card active:opacity-90"
        onPress={() => signOut()}
        accessibilityRole="button"
        accessibilityLabel="Sign out"
      >
        <Text className="text-base font-bold text-destructive">Sign out</Text>
      </Pressable>
    </ScreenLayout>
  );
}
