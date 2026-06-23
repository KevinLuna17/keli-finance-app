import { ProfileAvatar } from "@/components/profile/profile-avatar";
import type { WorkspaceMember } from "@/services/workspace-members/workspace-member.types";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

type WorkspaceMemberRowProps = {
  member: WorkspaceMember;
  subtitle?: string;
  canRemove?: boolean;
  isRemoving?: boolean;
  onRemove?: () => void;
};

export function WorkspaceMemberRow({
  member,
  subtitle,
  canRemove = false,
  isRemoving = false,
  onRemove,
}: WorkspaceMemberRowProps) {
  const displayName = member.name?.trim() || member.email;

  return (
    <View className="flex-row items-center rounded-2xl border border-border bg-card px-4 py-4">
      <ProfileAvatar
        profile={{
          name: member.name,
          email: member.email,
          imageUrl: member.imageUrl,
        }}
        size={44}
      />

      <View className="ml-3 flex-1">
        <Text className="text-base font-semibold text-card-foreground">
          {displayName}
        </Text>
        <Text className="mt-0.5 text-sm text-muted-foreground">
          {subtitle ?? member.email}
        </Text>
      </View>

      {canRemove ? (
        <Pressable
          className="rounded-xl border border-destructive px-3 py-2 active:opacity-80"
          onPress={onRemove}
          disabled={isRemoving}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${displayName}`}
        >
          {isRemoving ? (
            <ActivityIndicator color="#DC2626" size="small" />
          ) : (
            <Text className="text-sm font-semibold text-destructive">Remove</Text>
          )}
        </Pressable>
      ) : null}
    </View>
  );
}
