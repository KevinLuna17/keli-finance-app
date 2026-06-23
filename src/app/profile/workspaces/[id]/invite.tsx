import { InviteMemberScreen } from "@/components/profile/invite-member-screen";
import { useBackendSync } from "@/hooks/useBackendSync";
import ScreenLayout from "@/components/ui/ScreenLayout";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

export default function InviteMemberRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { workspaces, isBootstrapping, status } = useBackendSync();

  const workspace = workspaces.find((item) => item.id === id) ?? null;
  const isLoading = isBootstrapping || (status === "syncing" && workspaces.length === 0);

  if (isLoading) {
    return (
      <ScreenLayout
        edges={["bottom"]}
        background="modal"
        className="items-center justify-center"
      >
        <ActivityIndicator size="large" color="hsl(144, 16%, 37%)" />
      </ScreenLayout>
    );
  }

  if (
    !workspace ||
    workspace.type !== "shared" ||
    workspace.role !== "owner"
  ) {
    return (
      <ScreenLayout edges={["bottom"]} background="modal" className="px-6">
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-center text-base text-muted-foreground">
            Only shared workspace owners can invite members.
          </Text>
          <Pressable
            className="rounded-2xl bg-brand px-5 py-3"
            onPress={() => router.back()}
          >
            <Text className="font-semibold text-brand-foreground">Go back</Text>
          </Pressable>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <InviteMemberScreen
      workspaceId={workspace.id}
      workspaceName={workspace.name}
    />
  );
}
