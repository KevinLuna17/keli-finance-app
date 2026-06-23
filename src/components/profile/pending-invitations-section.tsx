import { InvitationListItem } from "@/components/profile/invitation-list-item";
import { TransactionsErrorState } from "@/components/transactions/transactions-error-state";
import type { UseInvitationsResult } from "@/hooks/use-invitations";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

type PendingInvitationsSectionProps = Pick<
  UseInvitationsResult,
  | "invitations"
  | "isLoading"
  | "error"
  | "actingInvitationId"
  | "refresh"
  | "accept"
  | "decline"
> & {
  onInvitationResolved?: () => Promise<void>;
};

export function PendingInvitationsSection({
  invitations,
  isLoading,
  error,
  actingInvitationId,
  refresh,
  accept,
  decline,
  onInvitationResolved,
}: PendingInvitationsSectionProps) {
  const handleAccept = async (invitationId: string) => {
    await accept(invitationId);
    await onInvitationResolved?.();
  };

  const handleDecline = async (invitationId: string) => {
    await decline(invitationId);
    await onInvitationResolved?.();
  };

  return (
    <View className="mt-8">
      <Text className="text-lg font-bold text-foreground">
        Pending Invitations
      </Text>

      {isLoading && invitations.length === 0 ? (
        <View className="mt-4 items-center py-8">
          <ActivityIndicator size="small" color="hsl(144, 16%, 37%)" />
        </View>
      ) : null}

      {error && invitations.length === 0 ? (
        <View className="mt-4">
          <TransactionsErrorState message={error} onRetry={refresh} />
        </View>
      ) : null}

      {!isLoading && !error && invitations.length === 0 ? (
        <View className="mt-4 rounded-2xl border border-dashed border-border bg-card px-4 py-6">
          <Text className="text-center text-sm text-muted-foreground">
            No pending invitations
          </Text>
        </View>
      ) : null}

      {invitations.length > 0 ? (
        <View className="mt-4 gap-3">
          {error ? (
            <Text className="text-sm text-destructive">{error}</Text>
          ) : null}
          {invitations.map((invitation) => (
            <InvitationListItem
              key={invitation.id}
              invitation={invitation}
              isActing={actingInvitationId === invitation.id}
              onAccept={() => handleAccept(invitation.id)}
              onDecline={() => handleDecline(invitation.id)}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}
