import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { TransactionsErrorState } from "@/components/transactions/transactions-error-state";
import ScreenLayout from "@/components/ui/ScreenLayout";
import { useProfile } from "@/hooks/use-profile";
import { useClerk } from "@clerk/expo";
import { Href, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useRef } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useClerk();
  const isFirstFocus = useRef(true);
  const { profile, isLoading, error, refresh } = useProfile();

  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }

      refresh();
    }, [refresh]),
  );

  if (isLoading && !profile) {
    return (
      <ScreenLayout
        edges={["top"]}
        background="custom"
        className="items-center justify-center"
      >
        <ActivityIndicator size="large" color="hsl(144, 16%, 37%)" />
      </ScreenLayout>
    );
  }

  if (error && !profile) {
    return (
      <ScreenLayout edges={["top"]} background="custom" className="flex-1">
        <TransactionsErrorState message={error} onRetry={refresh} />
      </ScreenLayout>
    );
  }

  if (!profile) {
    return null;
  }

  const displayName = profile.name?.trim() || "User";

  return (
    <ScreenLayout edges={["top"]} background="custom" className="flex-1">
      <ScrollView
        className="flex-1 px-6"
        contentContainerClassName="pb-8 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-bold text-foreground">Profile</Text>

        <View className="mt-8 items-center rounded-3xl bg-card p-6 shadow-sm">
          <ProfileAvatar profile={profile} size={96} />

          <Text className="mt-4 text-xl font-bold text-card-foreground">
            {displayName}
          </Text>
          <Text className="mt-1 text-sm text-muted-foreground">
            {profile.email}
          </Text>

          <Pressable
            className="mt-6 w-full items-center rounded-2xl bg-brand py-3"
            onPress={() => router.push("/profile/edit" as Href)}
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
          >
            <Text className="text-base font-semibold text-brand-foreground">
              Edit Profile
            </Text>
          </Pressable>
        </View>

        <Pressable
          className="mt-6 h-14 items-center justify-center rounded-2xl border border-border bg-card active:opacity-90"
          onPress={() => signOut()}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
        >
          <Text className="text-base font-bold text-destructive">Sign out</Text>
        </Pressable>
      </ScrollView>
    </ScreenLayout>
  );
}
