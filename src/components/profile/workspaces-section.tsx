import { WorkspaceListItem } from "@/components/profile/workspace-list-item";
import { ProfileGlassPressable } from "@/components/profile/profile-glass-card";
import { TransactionsErrorState } from "@/components/transactions/transactions-error-state";
import { useCurrentWorkspaceId, useSetCurrentWorkspaceId } from "@/hooks/use-current-workspace";
import { useBackendSync } from "@/hooks/useBackendSync";
import { hapticTabPress } from "@/lib/haptics";
import { Href, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

type WorkspacesSectionProps = {
  onWorkspaceChanged?: () => void;
};

export function WorkspacesSection({
  onWorkspaceChanged,
}: WorkspacesSectionProps) {
  const router = useRouter();
  const currentWorkspaceId = useCurrentWorkspaceId();
  const setCurrentWorkspaceId = useSetCurrentWorkspaceId();
  const {
    workspaces,
    isBootstrapping,
    status,
    error,
    refreshWorkspaces,
  } = useBackendSync();

  const isLoading = isBootstrapping || (status === "syncing" && workspaces.length === 0);
  const loadError = status === "error" ? error : null;

  const sortedWorkspaces = [...workspaces].sort((left, right) => {
    if (left.type === right.type) {
      return left.name.localeCompare(right.name);
    }

    return left.type === "personal" ? -1 : 1;
  });

  const handleSelect = (workspaceId: string) => {
    if (workspaceId === currentWorkspaceId) {
      return;
    }

    hapticTabPress();
    setCurrentWorkspaceId(workspaceId);
    onWorkspaceChanged?.();
  };

  return (
    <View className="mt-8">
      <Text className="text-lg font-bold text-foreground">Workspaces</Text>
      <Text className="mt-1 text-sm text-muted-foreground">
        Select the workspace used across Home, Transactions, and Statistics.
      </Text>

      {isLoading ? (
        <View className="mt-4 items-center py-8">
          <ActivityIndicator size="small" color="hsl(144, 16%, 37%)" />
        </View>
      ) : null}

      {loadError && workspaces.length === 0 ? (
        <View className="mt-4">
          <TransactionsErrorState
            message={loadError}
            onRetry={() => {
              void refreshWorkspaces();
            }}
          />
        </View>
      ) : null}

      {workspaces.length > 0 ? (
        <View className="mt-4 gap-3">
          {sortedWorkspaces.map((workspace) => (
            <WorkspaceListItem
              key={workspace.id}
              workspace={workspace}
              isActive={workspace.id === currentWorkspaceId}
              onSelect={() => handleSelect(workspace.id)}
              onEdit={
                workspace.type === "shared" && workspace.role === "owner"
                  ? () =>
                      router.push(
                        `/profile/workspaces/${workspace.id}/edit` as Href,
                      )
                  : undefined
              }
            />
          ))}
        </View>
      ) : null}

      {!isLoading && !loadError ? (
        <ProfileGlassPressable
          className="mt-4"
          contentClassName="h-14 flex-row items-center justify-center"
          onPress={() =>
            router.push("/profile/workspaces/create" as Href)
          }
          accessibilityRole="button"
          accessibilityLabel="Create workspace"
        >
          <Text className="text-base font-semibold text-brand">
            + Create Workspace
          </Text>
        </ProfileGlassPressable>
      ) : null}
    </View>
  );
}
