import type { WorkspaceInvitation } from "@/services/invitations/invitation.types";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

type InvitationListItemProps = {
  invitation: WorkspaceInvitation;
  isActing: boolean;
  onAccept: () => void;
  onDecline: () => void;
};

function getInviterLabel(invitation: WorkspaceInvitation): string {
  if (invitation.invitedByName) {
    return `Invited by ${invitation.invitedByName}`;
  }

  return "Invited to join";
}

export function InvitationListItem({
  invitation,
  isActing,
  onAccept,
  onDecline,
}: InvitationListItemProps) {
  return (
    <View className="rounded-2xl border border-border bg-card p-4">
      <Text className="text-base font-semibold text-card-foreground">
        {invitation.workspaceName}
      </Text>
      <Text className="mt-1 text-sm text-muted-foreground">
        {getInviterLabel(invitation)}
      </Text>

      <View className="mt-4 flex-row gap-3">
        <Pressable
          className={`flex-1 items-center rounded-xl py-3 ${
            isActing ? "bg-muted" : "bg-brand"
          }`}
          onPress={onAccept}
          disabled={isActing}
          accessibilityRole="button"
          accessibilityLabel={`Accept invitation to ${invitation.workspaceName}`}
        >
          {isActing ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-sm font-semibold text-brand-foreground">
              Accept
            </Text>
          )}
        </Pressable>

        <Pressable
          className="flex-1 items-center rounded-xl border border-border py-3 active:opacity-90"
          onPress={onDecline}
          disabled={isActing}
          accessibilityRole="button"
          accessibilityLabel={`Decline invitation to ${invitation.workspaceName}`}
        >
          <Text className="text-sm font-semibold text-foreground">Decline</Text>
        </Pressable>
      </View>
    </View>
  );
}
